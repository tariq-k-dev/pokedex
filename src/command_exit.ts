import { initState } from './state.js';

export function commandExit(): void {
  console.log('Closing the Pokedex... Goodbye!');
  initState().rl.close();
}
