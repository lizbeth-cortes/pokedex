let listaPokemon = document.getElementById('listaPokemon');
let botonesTipo = document.querySelectorAll('.btn-header');
let contenedorSpinner = document.getElementById('contenedor-spinner');
let contenedorCards = document.getElementById('todos');
let isBuscarUnPokemon = false;
let URL = "https://pokeapi.co/api/v2/pokemon/";

ocultarCarga();

function mostrarCarga() {
    contenedorSpinner.style.display = 'flex';
    contenedorCards.style.display = 'none';
}

function ocultarCarga() {
    contenedorCards.style.display = 'flex';
    contenedorSpinner.style.display = 'none';
}



async function obtenerPokemon() {
    let pokemonData = [];
    try {
        for (let i = 1; i <= 151; i++) {
            let response = await fetch(`${URL}${i}`);
            
            if (!response.ok) {
                throw new Error(`No se pudo obtener el Pokémon ${i}`);
            }
            
            let data = await response.json();
            pokemonData.push(data); 
        }
    } catch (error) {
        console.error('Error al obtener Pokémon:', error);
    }
    return pokemonData;
}


function mostrarPokemon(pokemon) {
    let traducciones = {
        normal: 'normal',
        fighting: 'lucha',
        flying: 'volador',
        poison: 'veneno',
        ground: 'tierra',
        rock: 'roca',
        bug: 'bicho',
        ghost: 'fantasma',
        steel: 'acero',
        fire: 'fuego',
        water: 'agua',
        grass: 'planta',
        electric: 'eléctrico',
        psychic: 'psíquico',
        ice: 'hielo',
        dragon: 'dragón',
        dark: 'siniestro',
        fairy: 'hada'
    };

    let tipos = pokemon.types.map(tipo => 
        `<p class="tipo ${tipo.type.name}">${traducciones[tipo.type.name] || tipo.type.name}</p>`
    );
    tipos = tipos.join('');
    
    let pokemonId = pokemon.id.toString();
    if (pokemonId.length === 1) {
        pokemonId = "00" + pokemonId;
    } else if (pokemonId.length === 2) {
        pokemonId = "0" + pokemonId;
    }

    let div = document.createElement("div");
    if (isBuscarUnPokemon) {
        div.classList.add("contenedor-card", "col-12");
        div.innerHTML = `
            <div class="card">
                <a href="#" class="">
                    <div class="pokemon-image">
                        <img src="${pokemon.sprites.other["official-artwork"].front_default}" class="" alt="${pokemon.name}">
                    </div>
                    <div class="card-body">
                        <div class="pokemon-info">
                            <div class="nombre-contenedor">
                                <p class="pokemon-id">#${pokemonId}</p>
                                <h2 class="pokemon-nombre">${pokemon.name}</h2>
                            </div>
                            <div class="pokemon-tipos">
                                ${tipos}
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
        
    } else {
        div.classList.add("contenedor-card", "col-12", "col-sm-6", "col-md-4", "col-lg-3");
        div.innerHTML = `
            <div class="card">
                <a href="#" class="">
                    <div class="pokemon-image">
                        <img src="${pokemon.sprites.other["official-artwork"].front_default}" class="img-fluid" alt="${pokemon.name}">
                    </div>
                    <div class="card-body">
                        <div class="pokemon-info">
                            <div class="nombre-contenedor">
                                <p class="pokemon-id">#${pokemonId}</p>
                                <h2 class="pokemon-nombre">${pokemon.name}</h2>
                            </div>
                            <div class="pokemon-tipos">
                                ${tipos}
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }

    listaPokemon.append(div);
}

botonesTipo.forEach(boton => {
    boton.addEventListener("click", (event) => {
        mostrarCarga();
        let botonId = event.currentTarget.id;
        listaPokemon.innerHTML = "";

        obtenerPokemon()
            .then(pokemones => {
                pokemones.forEach(pokemon => {
                    let tipos = pokemon.types.map(tipo => tipo.type.name);
                    if (botonId === "ver-todos") {
                        setTimeout(() => {
                            ocultarCarga();
                        mostrarPokemon(pokemon);
                        }, 1000); 
                    } else {
                        if (tipos.some(tipo => tipo.includes(botonId))) {
                            setTimeout(() => {
                                ocultarCarga();
                                mostrarPokemon(pokemon);
                            },1000);
                            
                        }
                    }
                });
            })
            .catch(error => console.error('Error al obtener y mostrar Pokémon:', error));
    });
});

function buscarPokemon() {
    mostrarCarga();
    isBuscarUnPokemon = true;
    listaPokemon.innerHTML = "";
    let inputPokemon = document.getElementById('buscadorPokemon').value.trim().toLowerCase();
    if (inputPokemon) {
        setTimeout(() => {
            fetch(`${URL}${inputPokemon}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Pokémon no encontrado');
                    }
                    return response.json();
                })
                .then(pokemon => {
                    ocultarCarga();
                    mostrarPokemon(pokemon);
                })
                .catch(error => {
                    ocultarCarga();
                    console.error('Error al buscar el Pokémon:', error);
                    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
                    errorModal.show();
                });
        }, 1000); 
    } else {
        ocultarCarga();
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
    }
}

