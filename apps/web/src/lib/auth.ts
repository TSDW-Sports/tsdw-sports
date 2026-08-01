import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "tsdw_staff_session";
const SESSION_DURATION = 60 * 60 * 8; // 8 hours

export interface StaffSession {
  staffUserId: string;
  email: string;
  role: "ADMIN" | "SCOREKEEPER";
}

function getSessionSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not defined");
  }

  return new TextEncoder().encode(secret);
}

export async function createStaffSession(
  session: StaffSession,
) {
  const token = await new SignJWT({
    email: session.email,
    role: session.role,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setSubject(session.staffUserId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSessionSecret());

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

export async function getStaffSession(): Promise<StaffSession | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    SESSION_COOKIE_NAME,
  )?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      getSessionSecret(),
      {
        algorithms: ["HS256"],
      },
    );

    if (
      !payload.sub ||
      typeof payload.email !== "string" ||
      (payload.role !== "ADMIN" &&
        payload.role !== "SCOREKEEPER")
    ) {
      return null;
    }

    return {
      staffUserId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export async function deleteStaffSession() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);
}