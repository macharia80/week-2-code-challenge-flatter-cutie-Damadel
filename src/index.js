const characterBar = document.getElementById("character-bar");
const characterName = document.getElementById("character-name");
const characterImage = document.getElementById("image");
const voteCount = document.getElementById("vote-count");
const votesForm = document.getElementById("votes-form");
const resetBtn = document.getElementById("reset-btn");

let currentCharacter = null;

// Fetch characters and show names in the bar
fetch("http://localhost:3000/characters")
  .then((res) => res.json())
  .then((characters) => {
    characters.forEach((character) => {
      const span = document.createElement("span");
      span.textContent = character.name;
      span.style.cursor = "pointer";
      span.addEventListener("click", () => showCharacter(character));
      characterBar.appendChild(span);
    });
  });

// Show character details
function showCharacter(character) {
  currentCharacter = character;
  characterName.textContent = character.name;
  characterImage.src = character.image;
  characterImage.alt = character.name;
  voteCount.textContent = character.votes;
}

// Add votes
votesForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const votesToAdd = parseInt(document.getElementById("votes").value);
  if (!isNaN(votesToAdd) && currentCharacter) {
    currentCharacter.votes += votesToAdd;
    voteCount.textContent = currentCharacter.votes;
    votesForm.reset();
  }
});

// Reset votes
resetBtn.addEventListener("click", () => {
  if (currentCharacter) {
    currentCharacter.votes = 0;
    voteCount.textContent = 0;
  }
});
