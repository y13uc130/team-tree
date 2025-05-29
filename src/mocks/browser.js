import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

console.log('intel ==> handlers', handlers);
export const worker = setupWorker(...handlers);
