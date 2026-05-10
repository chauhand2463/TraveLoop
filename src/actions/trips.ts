"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { generateShareToken } from "@/lib/utils";

export async function createTrip(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;

  if (!name || !startDate || !endDate) {
    return { error: "Name, start date, and end date are required" };
  }

  const trip = await prisma.trip.create({
    data: {
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userId: session.user.id,
      shareToken: generateShareToken(),
    },
  });

  redirect(`/trips/${trip.id}/builder`);
}

export async function updateTrip(tripId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const isPublic = formData.get("isPublic") === "true";

  await prisma.trip.update({
    where: { id: tripId, userId: session.user.id },
    data: {
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isPublic,
    },
  });

  return { success: true };
}

export async function deleteTrip(tripId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  await prisma.trip.delete({
    where: { id: tripId, userId: session.user.id },
  });

  redirect("/trips");
}

export async function toggleTripPublic(tripId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip || trip.userId !== session.user.id) return { error: "Not authorized" };

  await prisma.trip.update({
    where: { id: tripId },
    data: { isPublic: !trip.isPublic },
  });

  return { success: true, isPublic: !trip.isPublic };
}

export async function addStop(tripId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const cityId = formData.get("cityId") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;

  if (!cityId || !startDate || !endDate) {
    return { error: "City, start date, and end date are required" };
  }

  const maxOrder = await prisma.stop.aggregate({
    where: { tripId },
    _max: { order: true },
  });

  await prisma.stop.create({
    data: {
      tripId,
      cityId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  return { success: true };
}

export async function removeStop(stopId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  await prisma.stop.delete({ where: { id: stopId } });
  return { success: true };
}

export async function addActivityToStop(stopId: string, activityId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const activity = await prisma.activity.findUnique({ where: { id: activityId } });
  if (!activity) return { error: "Activity not found" };

  await prisma.stopActivity.create({
    data: {
      stopId,
      activityId,
      cost: activity.cost,
    },
  });

  return { success: true };
}

export async function removeActivityFromStop(stopActivityId: string) {
  await prisma.stopActivity.delete({ where: { id: stopActivityId } });
  return { success: true };
}

export async function addExpense(tripId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const category = formData.get("category") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const description = formData.get("description") as string;

  await prisma.expense.create({
    data: { tripId, category, amount, description },
  });

  return { success: true };
}

export async function deleteExpense(expenseId: string) {
  await prisma.expense.delete({ where: { id: expenseId } });
  return { success: true };
}

export async function addPackingItem(tripId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string || "Other";

  await prisma.packingItem.create({
    data: { tripId, name, category },
  });

  return { success: true };
}

export async function togglePackingItem(itemId: string) {
  const item = await prisma.packingItem.findUnique({ where: { id: itemId } });
  if (!item) return { error: "Item not found" };

  await prisma.packingItem.update({
    where: { id: itemId },
    data: { isPacked: !item.isPacked },
  });

  return { success: true };
}

export async function deletePackingItem(itemId: string) {
  await prisma.packingItem.delete({ where: { id: itemId } });
  return { success: true };
}

export async function addNote(tripId: string, formData: FormData) {
  const content = formData.get("content") as string;
  const stopId = formData.get("stopId") as string || null;

  await prisma.tripNote.create({
    data: { tripId, content, stopId },
  });

  return { success: true };
}

export async function updateNote(noteId: string, content: string) {
  await prisma.tripNote.update({
    where: { id: noteId },
    data: { content },
  });

  return { success: true };
}

export async function deleteNote(noteId: string) {
  await prisma.tripNote.delete({ where: { id: noteId } });
  return { success: true };
}
