"use client";

import {
  useActionState,
  useState,
} from "react";

import {
  registerParticipant,
  type RegistrationState,
} from "./actions";

interface Department {
  id: string;
  name: string;
  code: string;
}

interface RegistrationFormProps {
  competitionId: string;
  isTeam: boolean;
  departments: Department[];
}

interface Member {
  id: number;
  name: string;
  studentCode: string;
}

const initialState: RegistrationState = {
  success: false,
  message: "",
};

export function RegistrationForm({
  competitionId,
  isTeam,
  departments,
}: RegistrationFormProps) {
  const [state, formAction, isPending] =
    useActionState(
      registerParticipant,
      initialState,
    );

  // ---------------------------------------------------------
  // Main form state
  // ---------------------------------------------------------

  const [teamName, setTeamName] = useState("");
  const [departmentId, setDepartmentId] =
    useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [studentCode, setStudentCode] =
    useState("");

  // ---------------------------------------------------------
  // Team roster state
  // ---------------------------------------------------------

  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: "",
      studentCode: "",
    },
  ]);

  
  // ---------------------------------------------------------
  // Roster controls
  // ---------------------------------------------------------

  function addMember() {
    setMembers((current) => {
      const nextId =
        current.length > 0
          ? Math.max(
              ...current.map(
                (member) => member.id,
              ),
            ) + 1
          : 1;

      return [
        ...current,
        {
          id: nextId,
          name: "",
          studentCode: "",
        },
      ];
    });
  }

  function removeMember(memberId: number) {
    setMembers((current) =>
      current.filter(
        (member) => member.id !== memberId,
      ),
    );
  }

  function updateMemberName(
    memberId: number,
    value: string,
  ) {
    setMembers((current) =>
      current.map((member) =>
        member.id === memberId
          ? {
              ...member,
              name: value,
            }
          : member,
      ),
    );
  }

  function updateMemberStudentCode(
    memberId: number,
    value: string,
  ) {
    setMembers((current) =>
      current.map((member) =>
        member.id === memberId
          ? {
              ...member,
              studentCode: value,
            }
          : member,
      ),
    );
  }

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------

  return (
    <form
      action={formAction}
      className="border border-[var(--border)] rounded-lg bg-[var(--surface)] p-5 sm:p-7 space-y-6"
    >
      <input
        type="hidden"
        name="competitionId"
        value={competitionId}
      />

      {/* Team Name */}

      {isTeam && (
        <div>
          <label
            htmlFor="teamName"
            className="block text-sm font-semibold text-[var(--text-primary)] mb-2"
          >
            Team Name
          </label>

          <input
            id="teamName"
            name="teamName"
            type="text"
            required
            disabled={isPending || state.success}
            value={teamName}
            onChange={(event) =>
              setTeamName(event.target.value)
            }
            placeholder="Enter team name"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--canvas)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-strong)] disabled:opacity-60"
          />
        </div>
      )}

      {/* Department */}

      <div>
        <label
          htmlFor="departmentId"
          className="block text-sm font-semibold text-[var(--text-primary)] mb-2"
        >
          Department
        </label>

        <select
          id="departmentId"
          name="departmentId"
          required
          disabled={isPending || state.success}
          value={departmentId}
          onChange={(event) =>
            setDepartmentId(event.target.value)
          }
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--canvas)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-strong)] disabled:opacity-60"
        >
          <option value="" disabled>
            Select department
          </option>

          {departments.map((department) => (
            <option
              key={department.id}
              value={department.id}
            >
              {department.code} —{" "}
              {department.name}
            </option>
          ))}
        </select>
      </div>

      {/* Captain / Participant */}

      <div className="border-t border-[var(--border)] pt-6">
        <h2 className="font-bold text-[var(--text-primary)] mb-1">
          {isTeam
            ? "Captain Details"
            : "Participant Details"}
        </h2>

        <p className="text-sm text-[var(--text-muted)] mb-5">
          Provide the primary contact information for
          this registration.
        </p>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-[var(--text-primary)] mb-2"
            >
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              disabled={
                isPending || state.success
              }
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Full name"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--canvas)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-strong)] disabled:opacity-60"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[var(--text-primary)] mb-2"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={
                  isPending || state.success
                }
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Email address"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--canvas)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-strong)] disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-[var(--text-primary)] mb-2"
              >
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                required
                disabled={
                  isPending || state.success
                }
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                placeholder="Phone number"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--canvas)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-strong)] disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="studentCode"
              className="block text-sm font-semibold text-[var(--text-primary)] mb-2"
            >
              Student ID / Roll Number
            </label>

            <input
              id="studentCode"
              name="studentCode"
              type="text"
              required
              disabled={
                isPending || state.success
              }
              value={studentCode}
              onChange={(event) =>
                setStudentCode(
                  event.target.value,
                )
              }
              placeholder="Student ID or roll number"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--canvas)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-strong)] disabled:opacity-60"
            />
          </div>
        </div>
      </div>

      {/* Team Roster */}

      {isTeam && (
        <div className="border-t border-[var(--border)] pt-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="font-bold text-[var(--text-primary)] mb-1">
                Team Roster
              </h2>

              <p className="text-sm text-[var(--text-muted)]">
                Add the remaining players in your
                team. The captain is already counted
                as Player 1.
              </p>
            </div>

            <button
              type="button"
              onClick={addMember}
              disabled={
                isPending || state.success
              }
              className="shrink-0 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add Player
            </button>
          </div>

          <div className="space-y-4">
            {members.map(
              (member, index) => (
                <div
                  key={member.id}
                  className="rounded-lg border border-[var(--border)] bg-[var(--canvas)] p-4"
                >
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="text-sm font-bold text-[var(--text-primary)]">
                      Player {index + 2}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeMember(
                          member.id,
                        )
                      }
                      disabled={
                        isPending ||
                        state.success
                      }
                      className="text-xs font-semibold text-[var(--live)] hover:opacity-80 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor={`member-name-${member.id}`}
                        className="block text-sm font-semibold text-[var(--text-primary)] mb-2"
                      >
                        Full Name
                      </label>

                      <input
                        id={`member-name-${member.id}`}
                        name="memberName"
                        type="text"
                        required
                        disabled={
                          isPending ||
                          state.success
                        }
                        value={member.name}
                        onChange={(event) =>
                          updateMemberName(
                            member.id,
                            event.target.value,
                          )
                        }
                        placeholder="Player full name"
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-strong)] disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`member-student-code-${member.id}`}
                        className="block text-sm font-semibold text-[var(--text-primary)] mb-2"
                      >
                        Student ID / Roll Number
                      </label>

                      <input
                        id={`member-student-code-${member.id}`}
                        name="memberStudentCode"
                        type="text"
                        required
                        disabled={
                          isPending ||
                          state.success
                        }
                        value={
                          member.studentCode
                        }
                        onChange={(event) =>
                          updateMemberStudentCode(
                            member.id,
                            event.target.value,
                          )
                        }
                        placeholder="Student ID or roll number"
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-strong)] disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* Server response */}

      {state.message && (
        <div
          className={`rounded-lg border p-4 text-sm ${
            state.success
              ? "border-[var(--success)] text-[var(--success)]"
              : "border-[var(--live)] text-[var(--live)]"
          }`}
        >
          {state.message}
        </div>
      )}

      {/* Submit */}

      <div className="border-t border-[var(--border)] pt-6">
        <button
          type="submit"
          disabled={
            isPending || state.success
          }
          className="w-full sm:w-auto rounded-lg bg-[var(--text-primary)] text-[var(--canvas)] px-6 py-3 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? "Submitting..."
            : state.success
              ? "Registration Submitted"
              : "Submit Registration"}
        </button>

        <p className="text-xs text-[var(--text-muted)] mt-3">
          Registration will require approval from the
          REFLEX organizers.
        </p>
      </div>
    </form>
  );
}