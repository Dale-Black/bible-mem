import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient(); // This needs to stay server-side, PrismaClient should never be run client-side

export async function getFlashcards() {
  return await prisma.flashcard.findMany();
}
