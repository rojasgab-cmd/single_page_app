
const JOKE_API_URL = "https://v2.jokeapi.dev/joke/Any";
const GEEK_JOKE_API_URL = "https://geek-jokes.sameerkumar.website/api?format=json";

const jokeContent = document.querySelector("#joke-content");
const jokeCategory = document.querySelector("#joke-category");
const getJokeButton = document.querySelector("#get-joke");
const statusMessage = document.querySelector("#status");

getJokeButton.addEventListener("click", async () => {
  getJokeButton.disabled = true;
  getJokeButton.textContent = "Finding a joke...";
  statusMessage.textContent = "";
  jokeContent.replaceChildren();
  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "One moment...";
  jokeContent.append(loadingMessage);

  try {
    const useGeekJokes = Math.random() < 0.5;
    const response = await fetch(
      useGeekJokes ? GEEK_JOKE_API_URL : `${JOKE_API_URL}?safe-mode`,
    );
    if (!response.ok) {
      throw new Error(`Joke request failed (${response.status}).`);
    }

    const data = await response.json();
    if (!useGeekJokes && data.error) {
      throw new Error("The joke service couldn't find a joke right now.");
    }

    const lines = useGeekJokes
      ? [data.joke]
      : data.type === "twopart"
        ? [data.setup, data.delivery]
        : [data.joke];
    if (lines.some((line) => typeof line !== "string" || !line.trim())) {
      throw new Error("The joke service returned an invalid joke.");
    }

    jokeContent.replaceChildren(
      ...lines.map((line) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = line;
        return paragraph;
      }),
    );
    jokeCategory.textContent = `${useGeekJokes ? "Geek" : data.category} joke`;
  } catch (error) {
    jokeContent.replaceChildren();
    statusMessage.textContent = error instanceof Error
      ? error.message
      : "Something went wrong while getting a joke.";
  } finally {
    getJokeButton.disabled = false;
    getJokeButton.textContent = "Get another joke";
  }
});