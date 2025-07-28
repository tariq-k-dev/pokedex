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
  };
}
