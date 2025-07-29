import { State } from './state.js';

export function cleanInput(input: string): string[] {
  // This function correctly splits the input into command and arguments.
  return input.trim().toLowerCase().split(/\s+/);
}

export function startREPL(state: State): void {
  console.log('Welcome to the Pokedex! Type "help" for commands.');
  state.rl.prompt();

  state.rl
    .on('line', async (line: string) => {
      const parts = cleanInput(line);
      const commandName = parts[0];

      // FIX 1: Get the arguments from the input parts.
      const args = parts.slice(1);

      const command = state.commands[commandName];

      if (command) {
        try {
          await command.callback(state, ...args);
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
