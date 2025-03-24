	

// Base API URL
const baseURL = "http://localhost:3000/characters";
let currentCharacter = null;

// Fetch characters and display them
function fetchCharacters() {
    fetch(baseURL)
        .then(response => response.json())
        .then(characters => {
            const characterBar = document.getElementById("character-bar");
            characterBar.innerHTML = ""; // Clear existing list

        characters.forEach(character => addCharacterToBar(character));

        // Show first character by default
        if (characters.length > 0) {
            displayCharacterDetails(characters[0]);
            currentCharacter = characters[0];
        }
    })
    .catch(error => console.error("Error fetching characters:", error));
}

// Add a character to the sidebar
function addCharacterToBar(character) {
    const characterBar = document.getElementById("character-bar");

const span = document.createElement("span");
span.textContent = character.name;
span.classList.add("character-item");
span.style.cursor = "pointer";

span.addEventListener("click", () => {
    displayCharacterDetails(character);
    currentCharacter = character;
});

characterBar.appendChild(span);
}

// Display character details
function displayCharacterDetails(character) {
    document.getElementById("character-name").textContent = character.name;
    document.getElementById("character-image").src = character.image;
    document.getElementById("character-image").alt = character.name;
    document.getElementById("vote-count").textContent = character.votes;
}

// Handle voting form
document.getElementById("votes-form").addEventListener("submit", function (event) {
    event.preventDefault();
    if (!currentCharacter) return;

const voteInput = document.getElementById("votes");
const voteValue = parseInt(voteInput.value, 10);

if (!isNaN(voteValue) && voteValue > 0) {
    currentCharacter.votes += voteValue;
    document.getElementById("vote-count").textContent = currentCharacter.votes;

    // Update votes in database
    fetch(`${baseURL}/${currentCharacter.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votes: currentCharacter.votes })
    }).catch(error => console.error("Error updating votes:", error));
} else {
    alert("Please enter a valid positive number.");
}

voteInput.value = "";
});

// Reset Votes
document.getElementById("reset-btn").addEventListener("click", function () {
    if (!currentCharacter) return;

currentCharacter.votes = 0;
document.getElementById("vote-count").textContent = 0;

fetch(`${baseURL}/${currentCharacter.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ votes: 0 })
}).catch(error => console.error("Error resetting votes:", error));
});

// Add new character
document.getElementById("character-form").addEventListener("submit", function (event) {
    event.preventDefault();

const name = document.getElementById("new-name").value.trim();
const image = document.getElementById("image-url").value.trim();

if (!name || !image) {
    alert("Please enter a valid name and image URL.");
    return;
}

const newCharacter = { name, image, votes: 0 };

fetch(baseURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCharacter)
})
.then(response => response.json())
.then(savedCharacter => {
    addCharacterToBar(savedCharacter);
    displayCharacterDetails(savedCharacter);
    currentCharacter = savedCharacter;
})
.catch(error => console.error("Error adding character:", error));

document.getElementById("new-name").value = "";
document.getElementById("image-url").value = "";
});

// Delete character
document.getElementById("delete-btn").addEventListener("click", function () {
    if (!currentCharacter) return;

fetch(`${baseURL}/${currentCharacter.id}`, { method: "DELETE" })
.then(() => {
    alert(`${currentCharacter.name} has been deleted.`);
    fetchCharacters();
    currentCharacter = null;
    document.getElementById("detailed-info").innerHTML = "<p>Select a character</p>";
})
.catch(error => console.error("Error deleting character:", error));
});

// Load characters when page loads
fetchCharacters();









