import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is not defined. Please set JWT_SECRET in the environment."
  );
}

const SECRET = new TextEncoder().encode(JWT_SECRET);

const EXPIRES_IN = "7d";

export type AuthScope =
  | "PLATFORM"
  | "ORGANIZATION";

export type JwtPayload = {
  userId: number;
  email: string;
  role: string;
  organizationId: number | null;
  scope: AuthScope;
};

export async function generateToken(
  payload: JwtPayload
): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    organizationId: payload.organizationId,
    scope: payload.scope,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(SECRET);
}

export async function verifyToken(
  token: string
): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      SECRET,
      {
        algorithms: ["HS256"],
      }
    );

    if (
      typeof payload.userId !== "number" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string" ||
      (
        payload.organizationId !== null &&
        typeof payload.organizationId !== "number"
      ) ||
      (
        payload.scope !== "PLATFORM" &&
        payload.scope !== "ORGANIZATION"
      )
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      organizationId:
        payload.organizationId as number | null,
      scope: payload.scope as AuthScope,
    };
  } catch {
    return null;
  }
}