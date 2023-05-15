#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import TestServer from './testServer.js';
import TestWatcher from './testWatcher.js';

const argv = yargs(hideBin(process.argv))
  .option('tests', {
    alias: 't',
    type: 'string',
    description: 'Glob pattern for the test files',
    demandOption: true
  })
  .argv;

const testServer = new TestServer();
const testWatcher = new TestWatcher(argv.tests);

testWatcher.on('test', (testFile) => {
  testServer.emit('test', testFile);
});

testServer.start();
