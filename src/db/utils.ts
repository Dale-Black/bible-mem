import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient(); // This needs to stay server-side, PrismaClient should never be run client-side

export async function getFlashcards() {
  return await prisma.flashcard.findMany();
}

type updateFlashcard = {
  flashId: number | undefined;
  repetitions: number;
  interval: number;
  easeFactor: number;
};
export function updateFlashcard({
  flashId,
  repetitions,
  interval,
  easeFactor,
}: updateFlashcard) {
  return (
    console.log(flashId),
    prisma.flashcard.update({
      where: {
        id: flashId,
      },
      data: {
        repetitions: repetitions,
        previousInterval: interval,
        previousEaseFactor: easeFactor,
      },
    })
  );
}
