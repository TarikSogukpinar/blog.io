import { jwtVerify } from "jose";

export function getJwtSecret() {
  const secret = process.env.NEXT_PUBLIC_API_JWT_SECRET;

  console.log(secret, "secret");

  if (!secret) {
    throw new Error("No JWT secret set in environment variable");
  }
  return new TextEncoder().encode(secret);
}

export async function verifyJwtToken(token) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    console.log("Decoded token:", payload);
    return payload;
  } catch (error) {
    return null;
  }
}
