"use server";

import { prisma } from "@/lib/prisma";

export interface RegistrationValues {
  teamName: string;
  departmentId: string;
  name: string;
  email: string;
  phone: string;
  studentCode: string;
  memberNames: string[];
  memberStudentCodes: string[];
}

export interface RegistrationState {
  success: boolean;
  message: string;
  values?: RegistrationValues;
}

export async function registerParticipant(
  _previousState: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  // ---------------------------------------------------------
  // Read form data
  // ---------------------------------------------------------

  const competitionId = String(
    formData.get("competitionId") ?? "",
  ).trim();

  const teamName = String(
    formData.get("teamName") ?? "",
  ).trim();

  const name = String(
    formData.get("name") ?? "",
  ).trim();

  const email = String(
    formData.get("email") ?? "",
  ).trim();

  const phone = String(
    formData.get("phone") ?? "",
  ).trim();

  const studentCode = String(
    formData.get("studentCode") ?? "",
  ).trim();

  const departmentId = String(
    formData.get("departmentId") ?? "",
  ).trim();

  /*
   * Keep empty values.
   *
   * memberNames[index] must always correspond to
   * memberStudentCodes[index].
   */
  const memberNames = formData
    .getAll("memberName")
    .map((value) => String(value).trim());

  const memberStudentCodes = formData
    .getAll("memberStudentCode")
    .map((value) => String(value).trim());

  // ---------------------------------------------------------
  // Preserve submitted values when validation fails
  // ---------------------------------------------------------

  const submittedValues: RegistrationValues = {
    teamName,
    departmentId,
    name,
    email,
    phone,
    studentCode,
    memberNames,
    memberStudentCodes,
  };

  const fail = (message: string): RegistrationState => ({
    success: false,
    message,
    values: submittedValues,
  });

  try {
    // ---------------------------------------------------------
    // Basic validation
    // ---------------------------------------------------------

    if (
      !competitionId ||
      !name ||
      !email ||
      !phone ||
      !studentCode ||
      !departmentId
    ) {
      return fail("Please fill in all required fields.");
    }

    // ---------------------------------------------------------
    // Load competition
    // ---------------------------------------------------------

    const competition = await prisma.competition.findUnique({
      where: {
        id: competitionId,
      },
    });

    if (!competition) {
      return fail("Competition not found.");
    }

    if (competition.status === "CANCELLED") {
      return fail(
        "Registration is unavailable for this competition.",
      );
    }

    // ---------------------------------------------------------
    // Team-specific validation
    // ---------------------------------------------------------

    if (competition.entryType === "TEAM") {
      if (!teamName) {
        return fail("Team name is required.");
      }

      /*
       * Every member name must have a corresponding
       * student code.
       */
      if (memberNames.length !== memberStudentCodes.length) {
        return fail(
          "Some team member details are incomplete.",
        );
      }

      /*
       * Detect blank roster fields.
       */
      if (
        memberNames.some((value) => !value) ||
        memberStudentCodes.some((value) => !value)
      ) {
        return fail(
          "Please complete all team member details.",
        );
      }

      /*
       * Normalize student codes before comparing them.
       */
      const normalizedCaptainCode =
        studentCode.toLowerCase();

      const normalizedMemberCodes =
        memberStudentCodes.map((code) =>
          code.toLowerCase(),
        );

      /*
       * Captain must not appear again in the roster.
       */
      if (
        normalizedMemberCodes.includes(
          normalizedCaptainCode,
        )
      ) {
        return fail(
          "The captain cannot also be added as a team member.",
        );
      }

      /*
       * Prevent duplicate students inside the submitted roster.
       */
      if (
        new Set(normalizedMemberCodes).size !==
        normalizedMemberCodes.length
      ) {
        return fail(
          "The same student cannot be added to the team more than once.",
        );
      }
    }

    // ---------------------------------------------------------
    // Validate department
    // ---------------------------------------------------------

    const department = await prisma.department.findUnique({
      where: {
        id: departmentId,
      },
    });

    if (!department) {
      return fail("Invalid department.");
    }

    // ---------------------------------------------------------
    // Prevent captain / individual duplicate registration
    // ---------------------------------------------------------

    const existingRegistration =
      await prisma.competitionEntryMember.findFirst({
        where: {
          entry: {
            competitionId,
            status: {
              notIn: ["REJECTED", "WITHDRAWN"],
            },
          },

          participant: {
            studentCode: {
              equals: studentCode,
              mode: "insensitive",
            },
          },
        },
      });

    if (existingRegistration) {
      return fail(
        "This student is already registered for this competition.",
      );
    }

    // ---------------------------------------------------------
    // Prevent roster members from already being registered
    // ---------------------------------------------------------

    if (
      competition.entryType === "TEAM" &&
      memberStudentCodes.length > 0
    ) {
      const existingMemberRegistration =
        await prisma.competitionEntryMember.findFirst({
          where: {
            entry: {
              competitionId,
              status: {
                notIn: ["REJECTED", "WITHDRAWN"],
              },
            },

            participant: {
              studentCode: {
                in: memberStudentCodes,
                mode: "insensitive",
              },
            },
          },

          include: {
            participant: true,
          },
        });

      if (existingMemberRegistration) {
        return fail(
          `${existingMemberRegistration.participant.studentCode} is already registered for this competition.`,
        );
      }
    }

    // ---------------------------------------------------------
    // Determine entry name
    // ---------------------------------------------------------

    const entryName =
      competition.entryType === "TEAM"
        ? teamName
        : name;

    // ---------------------------------------------------------
    // Create registration atomically
    // ---------------------------------------------------------

    const result = await prisma.$transaction(
      async (tx) => {
        /*
         * Create captain for team competitions,
         * or participant for individual competitions.
         */
        const participant =
          await tx.participant.create({
            data: {
              name,
              email,
              phone,
              studentCode,
              departmentId,
            },
          });

        /*
         * Create competition entry.
         */
        const entry =
          await tx.competitionEntry.create({
            data: {
              name: entryName,
              status: "PENDING",
              competitionId,
              departmentId,
            },
          });

        /*
         * Connect captain / individual participant
         * to competition entry.
         */
        await tx.competitionEntryMember.create({
          data: {
            entryId: entry.id,
            participantId: participant.id,
            isCaptain:
              competition.entryType === "TEAM",
          },
        });

        // -----------------------------------------------------
        // Create additional team members
        // -----------------------------------------------------

        if (competition.entryType === "TEAM") {
          for (
            let index = 0;
            index < memberNames.length;
            index++
          ) {
            const memberName =
              memberNames[index];

            const memberStudentCode =
              memberStudentCodes[index];

            const memberParticipant =
              await tx.participant.create({
                data: {
                  name: memberName,
                  studentCode: memberStudentCode,
                  departmentId,
                },
              });

            await tx.competitionEntryMember.create({
              data: {
                entryId: entry.id,
                participantId:
                  memberParticipant.id,
                isCaptain: false,
              },
            });
          }
        }

        return {
          participant,
          entry,
        };
      },
    );

    console.log(
      "Registration created:",
      result.entry.id,
    );

    return {
      success: true,
      message:
        "Registration submitted successfully. It is awaiting approval.",
    };
  } catch (error) {
    console.error("Registration failed:", error);

    /*
     * Preserve form contents even if an unexpected
     * database/server error occurs.
     *
     * Otherwise the user could lose a large team roster
     * because of a temporary server problem.
     */
    return {
      success: false,
      message:
        "Registration failed. Please try again.",
      values: submittedValues,
    };
  }
}