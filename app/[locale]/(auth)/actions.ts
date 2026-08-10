"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema, loginSchema } from "@/lib/validation/auth";
import { rateLimit } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/get-client-ip";
import { logger } from "@/lib/logger";

export type AuthActionState = {
  error?: "invalid" | "rateLimited" | "emailExists" | "credentials" | "unknown";
  success?: boolean;
};

export async function registerAction(
  locale: string,
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const ip = await getClientIp();
  if (!rateLimit(`register:${ip}`, 5, 60_000)) {
    return { error: "rateLimited" };
  }

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "invalid" };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { error: "emailExists" };

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.create({
    data: { name: parsed.data.name, email: parsed.data.email, passwordHash },
  });

  logger.info({ email: parsed.data.email }, "user registered");

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) return { error: "unknown" };
    throw error;
  }

  return { success: true };
}

export async function loginAction(
  locale: string,
  callbackUrl: string | undefined,
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const ip = await getClientIp();
  if (!rateLimit(`login:${ip}`, 10, 60_000)) {
    return { error: "rateLimited" };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "invalid" };

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.type === "CredentialsSignin" ? "credentials" : "unknown" };
    }
    throw error;
  }

  return { success: true };
}
