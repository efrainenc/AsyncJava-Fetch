const cache = {};   // Cache API responses
let currentPokemon = null;

document.getElementById("findBtn").addEventListener("click", getPokemon);
document.getElementById("addBtn").addEventListener("click", addToTeam);

async function getPokemon() {
    const input = document.getElementById("pokemonInput").value.toLowerCase();

    if (!input) return;

    // Check cache first
    if (cache[input]) {
        displayPokemon(cache[input]);
        return;
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
        if (!response.ok) throw new Error("Not Found");

        const data = await response.json();

        cache[input] = data;   // Save to cache
        displayPokemon(data);

    } catch (error) {
        alert("Pokemon not found!");
    }
}

function displayPokemon(data) {
    currentPokemon = data;

    // Image (safe fallback)
    const image =
    data.sprites.front_default;

    document.getElementById("pokemonImage").src = image;

    // Sound (Gen 5 cries)
    const cryURL = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${data.id}.ogg`;
    document.getElementById("pokemonSound").src = cryURL;

    // Populate 4 dropdowns
    const selects = ["move1", "move2", "move3", "move4"];

    selects.forEach(id => {
        const select = document.getElementById(id);
        select.innerHTML = "";

        data.moves.forEach(move => {
            const option = document.createElement("option");
            option.value = move.move.name;
            option.textContent = move.move.name;
            select.appendChild(option);
        });
    });
}

function addToTeam() {
    if (!currentPokemon) return;

    const teamDiv = document.getElementById("team");

    const memberDiv = document.createElement("div");
    memberDiv.className = "team-member";

    const img = document.createElement("img");
    img.src = currentPokemon.sprites.front_default;

    const moveList = document.createElement("ul");

    ["move1", "move2", "move3", "move4"].forEach(id => {
        const move = document.getElementById(id).value;
        const li = document.createElement("li");
        li.textContent = move;
        moveList.appendChild(li);
    });

    memberDiv.appendChild(img);
    memberDiv.appendChild(moveList);
    teamDiv.appendChild(memberDiv);
}
