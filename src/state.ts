import { createInterface, type Interface } from 'readline';
import { stdin, stdout } from 'node:process';
import { getCommands } from './get_commands.js';
import { PokeAPI } from './pokeapi.js';

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State, ...args: string[]) => Promise<void>;
};

export type State = {
  commands: Record<string, CLICommand>;
  rl: Interface;
  pokeapi: PokeAPI;
  nextLocationsURL: string | null;
  prevLocationsURL: string | null;
};

export function initState(): State {
  const rl = createInterface({
    input: stdin,
    output: stdout,
    prompt: 'Pokedex > ',
  });
  const commands = getCommands();

  return {
    commands,
    rl,
    pokeapi: new PokeAPI(),
    nextLocationsURL: null,
    prevLocationsURL: null,
  };
}
