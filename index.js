const express = require('express');
const fetch = require('node-fetch');
const pokemon = require('pokemon');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


/*
----------------------------Random search----------------------------------
*/


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

    for (const type of pokemonData.types) {
      const typeResponse = await fetch(type.type.url);
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
  }
});


/*
----------------------------Region-----------------------------------
*/

app.get('/search', (req, res) => {
  res.render('search');
});

app.post('/region', async (req, res) => {
  try {
    const pokemonName = req.body.pokemonName;
    const pokeApiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;

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
  }
});

/*
---------------------------Trivia------------------------------------
*/

app.get('/trivia', async (req, res) => {
  try {
    const pokeApiUrl = 'https://pokeapi.co/api/v2/pokemon/1'; // get the data for Bulbasaur
    const pokeApiResponse = await fetch(pokeApiUrl);
    const pokemonData = await pokeApiResponse.json();
    const pokemonName = pokemonData.name;

    res.render('trivia', { question: `Who is the very first Pokemon in the Pokemon Pokedex?` });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from the Pokemon API');
  }
});

app.post('/trivia', async (req, res) => {
  const answer = req.body.answer.toLowerCase();
  const pokeApiUrl = 'https://pokeapi.co/api/v2/pokemon/1'; // get the data for Bulbasaur
  try {
    const pokeApiResponse = await fetch(pokeApiUrl);
    const pokemonData = await pokeApiResponse.json();
    const correctAnswer = pokemonData.name.toLowerCase();

    if (answer === correctAnswer) {
      res.render('triviaResult', { image: 'happy_pokemon.jpg' });
    } else {
      res.render('triviaResult', { image: 'sad_pokemon.jpg' });
    }
  } catch (error) {
    console.error(error);
  }
});


/*
----------------------------More trivia------------------------------
*/

app.get('/mewTrivia', async (req, res) => {
  try {
    const pokeApiUrl = 'https://pokeapi.co/api/v2/pokemon/151'; // get the data for Bulbasaur
    const pokeApiResponse = await fetch(pokeApiUrl);
    const pokemonData = await pokeApiResponse.json();
    const pokemonName = pokemonData.name;

    res.render('mewTrivia', { question: `What pokemon is 151 in the Pokemon Pokedex?` });
  } catch (error) {
    console.error(error);
  }
});

app.post('/mewTrivia', async (req, res) => {
  const answer = req.body.answer.toLowerCase();
  const pokeApiUrl = 'https://pokeapi.co/api/v2/pokemon/151'; // get the data for Bulbasaur
  try {
    const pokeApiResponse = await fetch(pokeApiUrl);
    const pokemonData = await pokeApiResponse.json();
    const correctAnswer = pokemonData.name.toLowerCase();

    if (answer === correctAnswer) {
      res.render('mewTriviaResult', { image: 'happy_pokemon.jpg' });
    } else {
      res.render('mewTriviaResult', { image: 'sad_pokemon.jpg' });
    }
  } catch (error) {
    console.error(error);
  }
});

/*
------------------Server started---------------------------
*/


app.listen(3000, () => {
  console.log('Server started');
});
