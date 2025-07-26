import { CLICommand } from './state.js';

export function commandHelp(commands: Record<string, CLICommand>): void {
  console.log('\nWelcome to the Pokedex!\nUsage:\n');

  for (const command of Object.values(commands)) {
    console.log(`${command.name}: ${command.description}`);
  }
}
