const express = require('express');
const fetch = require('node-fetch');
const pokemon = require('pokemon');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  try {
    const randomPokemon = pokemon.random();
    const pokeApiUrl = `https://pokeapi.co/api/v2/pokemon/${randomPokemon.toLowerCase()}`;

    const pokeApiResponse = await fetch(pokeApiUrl);
    const pokemonData = await pokeApiResponse.json();
    const pokemonNumber = pokemonData.id;
    const pokemonType = pokemonData.types[0].type.name;
    const strengths = [];
    const weaknesses = [];

    for (const pokemonType of pokemonData.types) {
      const typeResponse = await fetch(pokemonType.type.url);
      const typeData = await typeResponse.json();

      const doubleDamageTo = typeData.damage_relations.double_damage_to;
      const doubleDamageFrom = typeData.damage_relations.double_damage_from;

      for (const type of doubleDamageTo) {
        strengths.push(type.name);
      }

      for (const type of doubleDamageFrom) {
        weaknesses.push(type.name);
      }
    }

    res.render('home', {
      randomPokemon,
      pokemonImgUrl: pokemonData.sprites.front_default,
      pokemonNumber,
      pokemonType,
      strengths,
      weaknesses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from the Pokemon API');
  }
});

app.get('/search', (req, res) => {
  res.render('search');
});

app.post('/region', async (req, res) => {
  const pokemonName = req.body.pokemonName;
  const pokeApiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;
  try {
    const pokeApiResponse = await fetch(pokeApiUrl);
    const pokemonData = await pokeApiResponse.json();
    const pokemonSpeciesUrl = pokemonData.species.url;
    const speciesResponse = await fetch(pokemonSpeciesUrl);
    const speciesData = await speciesResponse.json();
    const regionUrl = speciesData.generation.url;
    const regionResponse = await fetch(regionUrl);
    const regionData = await regionResponse.json();
    const region = regionData.main_region.name;
    res.render('region', { pokemonName, region });
  } catch (error) {
    console.error(error);
    res.status(404).send('Pokemon not found');
  }
});

app.listen(3000, () => {
  console.log('Server started');
});

// the plan:
// generate a random poekmon
// the next page shows its region (user types it in)
