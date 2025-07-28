// repl.ts

import { State } from './state.js';

// 1. Add and export this function. The test file needs it.
export function cleanInput(input: string): string[] {
  return input.trim().toLowerCase().split(/\s+/);
}

export function startREPL(state: State): void {
  console.log('Welcome to the Pokedex! Type "help" for commands.');
  state.rl.prompt();

  state.rl
    .on('line', async (line: string) => {
      // 2. Use the new cleanInput function to parse the command
      const parts = cleanInput(line);
      const commandName = parts[0];
      // const args = parts.slice(1); // For commands that need arguments later

      const command = state.commands[commandName];

      if (command) {
        try {
          // The callback doesn't need args for map/mapb, so this is fine
          await command.callback(state);
        } catch (error) {
          console.error('An error occurred while executing the command.');
        }
      } else if (commandName) {
        console.log('Unknown command. Type "help" for a list of commands.');
      }

      state.rl.prompt();
    })
    .on('close', () => {
      console.log('Exiting Pokedex. Goodbye!');
      process.exit(0);
    });
}
