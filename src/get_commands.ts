import { CLICommand, State } from './state.js';

export function getCommands(): Record<string, CLICommand> {
  return {
    exit: {
      name: 'exit',
      description: 'Exits the Pokedex',
      async callback(state: State) {
        state.rl.close();
      },
    },
    help: {
      name: 'help',
      description: 'Displays a help message',
      async callback(state: State) {
        console.log('Available commands:');
        for (const command of Object.values(state.commands)) {
          console.log(`- ${command.name}: ${command.description}`);
        }
      },
    },
    map: {
      name: 'map',
      description: 'Displays the next 20 location areas in the Pokemon world.',
      async callback(state: State) {
        const locationsData = await state.pokeapi.fetchLocations(
          state.nextLocationsURL
        );
        state.nextLocationsURL = locationsData.next;
        state.prevLocationsURL = locationsData.previous;
        locationsData.results.forEach((location) =>
          console.log(location.name)
        );
      },
    },
    mapb: {
      name: 'mapb',
      description: 'Displays the previous 20 location areas.',
      async callback(state: State) {
        if (!state.prevLocationsURL) {
          console.log("You're on the first page.");
          return;
        }
        const locationsData = await state.pokeapi.fetchLocations(
          state.prevLocationsURL
        );
        state.nextLocationsURL = locationsData.next;
        state.prevLocationsURL = locationsData.previous;
        locationsData.results.forEach((location) =>
          console.log(location.name)
        );
      },
    },
    explore: {
      name: 'explore',
      description: 'Explores a location area to find encounterable Pokemon.',
      // Use ...args to capture all arguments passed to the command
      async callback(state: State, ...args: string[]) {
        if (args.length === 0) {
          console.log('Error: You must provide a location area name.');
          console.log('Example: explore pastoria-city-area');
          return;
        }
        // Join all arguments with a hyphen to match the API's naming convention
        const locationAreaName = args.join('-');
        console.log(`Exploring ${locationAreaName}...`);

        try {
          const locationArea = await state.pokeapi.fetchLocationArea(
            locationAreaName
          );

          if (!locationArea) {
            console.log(`Location area "${locationAreaName}" not found.`);
            return;
          }

          if (locationArea.pokemon_encounters.length === 0) {
            console.log('Found no Pokemon in this area.');
            return;
          }

          console.log('Found Pokemon:');
          locationArea.pokemon_encounters.forEach((encounter) => {
            console.log(` - ${encounter.pokemon.name}`);
          });
        } catch (error) {
          // This will catch network errors from the fetch call
          console.error('An error occurred while exploring the area.');
        }
      },
    },
    catch: {
      name: 'catch',
      description: 'Attempts to catch a Pokemon and add it to your Pokedex.',
      async callback(state: State, ...args: string[]) {
        if (args.length !== 1) {
          console.log('Error: You must provide the name of one Pokemon.');
          console.log('Example: catch pikachu');
          return;
        }
        const pokemonName = args[0];

        if (state.pokedex[pokemonName]) {
          console.log(`${pokemonName} is already in your Pokedex!`);
          return;
        }

        console.log(`Throwing a Pokeball at ${pokemonName}...`);

        try {
          const pokemon = await state.pokeapi.fetchPokemonByName(pokemonName);

          if (!pokemon) {
            console.log(`Pokemon "${pokemonName}" not found.`);
            return;
          }

          // The higher the base_experience, the lower the chance.
          // We'll use a threshold to calculate a probability.
          // A value of 300 gives a decent chance for most early-game Pokemon.
          const CATCH_THRESHOLD = 300;
          const catchChance = Math.max(
            0.1,
            (CATCH_THRESHOLD - pokemon.base_experience) / CATCH_THRESHOLD
          );
          const roll = Math.random();

          if (roll < catchChance) {
            console.log(`${pokemonName} was caught!`);
            state.pokedex[pokemonName] = pokemon;
          } else {
            console.log(`${pokemonName} escaped!`);
          }
        } catch (error) {
          console.error(
            'An error occurred while trying to catch the Pokemon.'
          );
        }
      },
    },
  };
}
