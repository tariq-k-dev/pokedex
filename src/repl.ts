import { State } from './state.js';

export function cleanInput(input: string): string[] {
  return input.trim().split(/\s+/);
}

export function startREPL({
  rl,
  commands,
}: {
  rl: State['rl'];
  commands: State['commands'];
}): void {
  rl.prompt();

  rl.on('line', (input) => {
    const cleanedInput = cleanInput(input);
    const commandName = cleanedInput[0];

    if (commands[commandName]) {
      try {
        commands[commandName].callback(commands);
      } catch (error) {
        console.error(`Error executing command '${commandName}':`, error);
      }
    } else {
      console.log('Unknown command');
    }

    rl.prompt();
  });
}
