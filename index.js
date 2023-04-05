const express = require('express');
const pokemon = require('pokemon');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
  const randomPokemon = pokemon.random();
  const pokeApiUrl = `https://pokeapi.co/api/v2/pokemon/${randomPokemon.toLowerCase()}`;

  try {
    const pokeApiResponse = await fetch(pokeApiUrl);
    const pokemonData = await pokeApiResponse.json();
    const pokemonImgUrl = pokemonData.sprites.front_default;

    res.render('home', {
      randomPokemon,
      pokemonImgUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching pokemon data');
  }
});

app.listen(3000, () => {
  console.log('Server started');
});



// the plan:
// generate a random poekmon
// the next page shows its type (user types it in)
// the next page shows its region (user types it in)
// the next page shows its strengths and weakness (user types it in)

