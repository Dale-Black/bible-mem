import logo from "../images/bible.png";
import { A, Html, Head, Title, Meta } from "solid-start";
import { PrismaClient } from "@prisma/client";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";

const prisma = new PrismaClient();

export function routeData() {
  return createServerData$(() => prisma.flashcard.findMany());
}

const Dashboard = () => {
  const fCards = useRouteData<typeof routeData>();
  console.log(fCards);
  return (
    <>
      <Html lang="en">
        <Head>
          <Title>Bible Mem</Title>
          <Meta name="description" content="Spaced Repitition Bible Memory" />
          <A rel="icon" href="/favicon.ico" />
        </Head>
      </Html>
      <main class="flex h-screen flex-col items-center">
        <div class="navbar grid grid-cols-2 bg-transparent pl-10">
          <A href="/" class="">
            <img src={logo} width={48} height={48} alt="Logo" />
            <h1 class="ml-2 justify-self-start text-2xl">Bible Mem</h1>
          </A>
          <A href="/flashcards" class="btn justify-self-end">
            Flashcards
            <button class="btn btn-disabled">{fCards.length}</button>
          </A>
        </div>
        <div class="flex flex-col items-center justify-center gap-12 px-4 py-8">
          <div class="flex px-4 text-2xl">
            <p>
              Memorize scripture using{" "}
              <A
                class="link"
                href="https://en.wikipedia.org/wiki/Spaced_repetition"
              >
                spaced repetition
              </A>{" "}
              and never forget it again.
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
