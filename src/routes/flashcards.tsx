import { Show, createSignal } from "solid-js";
import { PrismaClient } from "@prisma/client";
import { createServerData$ } from "solid-start/server";
import { useRouteData } from "solid-start";

const prisma = new PrismaClient();

export function routeData() {
  return createServerData$(() => prisma.flashcard.findMany());
}

const Flashcards = () => {
  const fCards = useRouteData<typeof routeData>();
  const [show, setShow] = createSignal(false);
  const [index, setIndex] = createSignal(0);
  const card = () => fCards()?.[index()];
  const _card = card();
  if (!_card) return;

  // if (!card()) {
  //   return null;
  // }

  const [easinessData, intervalData, repetitionsData, reviewDateData] = [
    _card.easiness,
    _card.interval,
    _card.repetitions,
    new Date(_card.reviewDate),
  ];

  function review(
    easiness: number,
    interval: number,
    repetitions: number,
    quality: number,
    reviewDate: Date = new Date()
  ): [number, number, number, Date] {
    const today = new Date();

    if (repetitions <= 1) {
      reviewDate = today;
      repetitions = repetitions + 1;
      return [easiness, interval, repetitions, reviewDate];
    } else {
      if (!reviewDate) {
        reviewDate = new Date();
      }

      if (typeof reviewDate === "string") {
        reviewDate = new Date(reviewDate);
      }

      if (quality < 3) {
        interval = 1;
        repetitions = 0;
      } else {
        if (repetitions === 0) {
          interval = 1;
        } else if (repetitions === 1) {
          interval = 6;
        } else {
          interval = Math.ceil(interval * easiness);
        }

        repetitions = repetitions + 1;
      }

      if (easiness < 1.3) {
        easiness = 1.3;
      }

      easiness += 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);

      reviewDate.setDate(reviewDate.getDate() + interval);

      return [easiness, interval, repetitions, reviewDate];
    }
  }

  // const [cardAttributes, setCardAttributes] = createSignal(
  //   review(easinessData, intervalData, repetitionsData, 3, reviewDateData)
  // );

  function handleIncorrect() {
    // setCardAttributes(
    //   review(easinessData, intervalData, repetitionsData, 1, reviewDateData)
    // );
    console.log(
      review(easinessData, intervalData, repetitionsData, 3, reviewDateData)
    );
    setIndex((index() + 1) % fCards()?.length);
    setShow(false);
  }

  function handleCorrect() {
    // setCardAttributes(
    //   review(easinessData, intervalData, repetitionsData, 3, reviewDateData)
    // );
    console.log(
      review(easinessData, intervalData, repetitionsData, 3, reviewDateData)
    );
    setIndex((index() + 1) % fCards()?.length);
    setShow(false);
  }

  function handlePerfect() {
    // setCardAttributes(
    //   review(easinessData, intervalData, repetitionsData, 5, reviewDateData)
    // );
    console.log(
      review(easinessData, intervalData, repetitionsData, 3, reviewDateData)
    );
    setIndex((index() + 1) % fCards()?.length);
    setShow(false);
  }

  return (
    <>
      <main class="flex h-screen flex-col items-center justify-center">
        <div class="card bg-neutral text-neutral-content px-auto w-full max-w-xl ">
          <div class="card-body items-center">
            <h2 class="card-title mb-10">{card()?.heading}</h2>
            <Show when={show()}>
              <p class="mb-10">{card()?.text}</p>
            </Show>
            <div class="card-actions justify-end">
              <Show when={!show()}>
                <button class="btn btn-primary" onclick={() => setShow(true)}>
                  Show Answer
                </button>
              </Show>
              <Show when={show()}>
                <div class="flex-row items-center space-x-2">
                  <button
                    onclick={() => handleIncorrect()}
                    class="btn btn-md bg-red-300 text-black hover:bg-red-500"
                  >
                    <div class="py-1">
                      Incorrect{" "}
                      <span class="bg-neutral rounded-md p-2 text-white">
                        {/* {incorrect()} */}
                      </span>
                    </div>
                  </button>
                  <button
                    onclick={() => handleCorrect()}
                    class="btn btn-md bg-lime-300 text-black hover:bg-lime-500"
                  >
                    <div class="py-1">
                      Correct{" "}
                      <span class="bg-neutral rounded-md p-2 text-xs text-white">
                        {/* {correct()} */}
                      </span>
                    </div>
                  </button>
                  <button
                    onclick={() => handlePerfect()}
                    class="btn btn-md bg-emerald-400 text-black hover:bg-emerald-700"
                  >
                    <div class="py-1">
                      Perfect{" "}
                      <span class="bg-neutral rounded-md p-2 text-xs text-white">
                        {/* {perfect()} */}
                      </span>
                    </div>
                  </button>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Flashcards;

// function differenceBetweenDates(futureDate: Date) {
//   const currentDate = new Date().getTime();
//   const differenceInMilliseconds = futureDate.getTime() - currentDate;
//   const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
//   const differenceInHours = differenceInMinutes / 60;

//   if (differenceInMinutes < 30) {
//     return Math.round(differenceInMinutes) + " minutes";
//   } else if (differenceInHours < 10) {
//     return Math.round(differenceInHours) + " hours";
//   } else {
//     const differenceInDays = differenceInMinutes / 1440;
//     return Math.round(differenceInDays) + " days";
//   }
// }

// function incorrect() {
//   const [a, b, c, newReviewDate] = review(
//     easinessD,
//     intervalD,
//     repetitionsD,
//     1,
//     reviewDateD
//   );
//   return differenceBetweenDates(newReviewDate);
// }

// function correct() {
//   const [a, b, c, newReviewDate] = review(
//     easinessD,
//     intervalD,
//     repetitionsD,
//     3,
//     reviewDateD
//   );
//   return differenceBetweenDates(newReviewDate);
// }

// function perfect() {
//   const [a, b, c, newReviewDate] = review(
//     easinessD,
//     intervalD,
//     repetitionsD,
//     5,
//     reviewDateD
//   );
//   return differenceBetweenDates(newReviewDate);
// }
