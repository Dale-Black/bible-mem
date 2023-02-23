import { Show, createSignal } from "solid-js";
import { createServerData$ } from "solid-start/server";
import { useRouteData } from "solid-start";
import { getFlashcards, updateFlashcard } from "~/db/utils";
import server$ from "solid-start/server";

function calcReview(
  quality: number,
  repetitions: number = 0,
  previousInterval: number,
  previousEaseFactor: number
) {
  let interval;
  let easeFactor;
  if (quality >= 3) {
    switch (repetitions) {
      case 0:
        interval = 1;
        break;
      case 1:
        interval = 6;
        break;
      default:
        interval = Math.round(previousInterval * previousEaseFactor);
    }

    repetitions++;
    easeFactor =
      previousEaseFactor +
      (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  } else {
    repetitions = 0;
    interval = 1;
    easeFactor = previousEaseFactor;
  }

  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  return [interval, repetitions, easeFactor];
}

export function routeData() {
  return createServerData$(getFlashcards);
}

const Flashcards = () => {
  const fCards = useRouteData<typeof routeData>();
  const [show, setShow] = createSignal(false);
  const [index, setIndex] = createSignal(0);
  const card = () => fCards()?.[index()];

  function handleIncorrect() {
    const [interval, repetitions, easeFactor] = calcReview(
      0,
      card()?.repetitions,
      card()?.previousInterval,
      card()?.previousEaseFactor
    );
    server$(updateFlashcard(card()?.id, interval, repetitions, easeFactor));
    setIndex((index() + 1) % fCards()?.length);
    setShow(false);
  }

  function handleCorrect() {
    const [interval, repetitions, easeFactor] = calcReview(
      3,
      card()?.repetitions,
      card()?.previousInterval,
      card()?.previousEaseFactor
    );
    server$(updateFlashcard(card()?.id, interval, repetitions, easeFactor));
    setIndex((index() + 1) % fCards()?.length);
    setShow(false);
  }

  function handlePerfect() {
    const [interval, repetitions, easeFactor] = calcReview(
      5,
      card()?.repetitions,
      card()?.previousInterval,
      card()?.previousEaseFactor
    );
    server$(updateFlashcard(card()?.id, interval, repetitions, easeFactor));
    setIndex((index() + 1) % fCards()?.length);
    setShow(false);
  }

  function previewIncorrect() {
    const [interval, repetitions, easeFactor] = calcReview(
      0,
      card()?.repetitions,
      card()?.previousInterval,
      card()?.previousEaseFactor
    );
    return interval;
  }

  function previewCorrect() {
    const [interval, repetitions, easeFactor] = calcReview(
      3,
      card()?.repetitions,
      card()?.previousInterval,
      card()?.previousEaseFactor
    );
    return interval;
  }

  function previewPerfect() {
    const [interval, repetitions, easeFactor] = calcReview(
      5,
      card()?.repetitions,
      card()?.previousInterval,
      card()?.previousEaseFactor
    );
    return interval;
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
                        {previewIncorrect()}
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
                        {previewCorrect()}
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
                        {previewPerfect()}
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
