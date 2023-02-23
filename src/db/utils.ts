import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient(); // This needs to stay server-side, PrismaClient should never be run client-side

export async function getFlashcards() {
  return await prisma.flashcard.findMany();
}

export async function getFlashcard(todoId: number) {
  return await prisma.flashcard.findUnique({
    where: {
      id: todoId,
    },
  });
}

// If you wanted to update the status of a todo
export async function updateFlashcard(
  flashcardId: number,
  interval: number,
  repetitions: number,
  easeFactor: number
) {
  return await prisma.flashcard.update({
    where: { id: flashcardId },
    data: {
      repetitions: repetitions,
      previousInterval: interval,
      previousEaseFactor: easeFactor,
    },
  });
}
