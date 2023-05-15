#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chokidar from 'chokidar';
import { rollup, watch } from 'rollup';
import rollupConfig from './rollup.config.js';
import fs from 'fs';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const argv = yargs(hideBin(process.argv))
  .option('tests', {
    alias: 't',
    type: 'string',
    description: 'Glob pattern for the test files',
    demandOption: true
  })
  .argv;

let app = express();
app.use(express.text())

// Determine the path to the `src` directory within your package.
// const srcDir = path.resolve(__dirname, 'src');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname, { index: 'index.html' }));

// Serve static files from the `dist` directory in the user's project.
// Assume the `dist` directory is in the current working directory.
app.use('/dist', express.static(path.join(process.cwd(), 'dist')));

let clients = [];

app.get('/test', (req, res) => {
  console.log('New client connected');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Connection', 'keep-alive');
  clients.push(res);
});

app.post('/log', (req, res) => {
    const message = req.body;
    console.log('TEST:', message);
    res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

const watcher = chokidar.watch(argv.tests, {
  persistent: true,
  ignoreInitial: false
});

watcher.on('add', filePath => {
  createRollupWatcher(filePath);
});

function createRollupWatcher(file) {
  const watchOptions = {
    ...rollupConfig,
    input: file,
    output: {
      ...rollupConfig.output,
      file: `./dist/${file}`
    }
  };

  const watcher = watch(watchOptions);

  watcher.on('event', async (event) => {
    try {
      if (event.code === 'END') {
        const bundle = await rollup(watchOptions);
        const { output } = await bundle.generate(rollupConfig.output);
        const result = output[0].code;
        fs.writeFileSync(`./dist/${file}`, result);

        // Send updates to all connected clients
        clients.forEach(res => {
          res.write(`{"test": "/dist/${file}"}\n`);
          res.end()
        });

        console.log(`Successfully bundled ${file}.`);
      }

      if (event.code === 'START') {
        console.log(`Bundling ${file}...`);
      }

      if (event.code === 'ERROR') {
        console.error(`Error bundling ${file}:`, event.error);
      }
    } catch (err) {
      console.error(`Error during Rollup bundling process for ${file}:`, err);
    }
  });
}
