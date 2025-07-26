import { createInterface, type Interface } from 'readline';
import { stdin, stdout } from 'node:process';
import { getCommands } from './get_commands.js';

export type CLICommand = {
  name: string;
  description: string;
  callback: (commands: Record<string, CLICommand>) => void;
};

export type State = {
  commands: Record<string, CLICommand>;
  currentCommand: CLICommand | null;
  rl: Interface;
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
    currentCommand: null,
    rl,
  };
}
