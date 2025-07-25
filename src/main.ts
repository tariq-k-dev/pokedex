// repl.js actually refers to repl.ts
import { startREPL } from './repl.js';
import { initState } from './state.js';

function main() {
  const state = initState();
  startREPL({ rl: state.rl, commands: state.commands });
}

main();
