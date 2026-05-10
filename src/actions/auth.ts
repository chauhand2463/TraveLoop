"use server";

import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) {
    return { error: "All fields are required" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Email already registered" };
  }

  try {
    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { name, email, password: hashed },
    });

    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (err) {
    console.error("Registration error:", err);
    return { error: "Failed to create account" };
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (err) {
    console.error("Login error:", err);
    return { error: "Invalid email or password" };
  }
}

export async function updateProfile(userId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const language = formData.get("language") as string;

  await prisma.user.update({
    where: { id: userId },
    data: { name, language },
  });

  return { success: true };
}

export async function deleteAccount(userId: string) {
  await prisma.user.delete({ where: { id: userId } });
  redirect("/login");
}
