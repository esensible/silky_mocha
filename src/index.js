#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('tests', {
    alias: 't',
    type: 'string',
    description: 'Glob pattern for the test files',
    demandOption: true
  })
  .argv;

console.log(argv.glob);

export default {}


// const express = require('express');
// const rollup = require('rollup');
// const rollupConfig = require('./rollup.config');
// const fs = require('fs');
// const app = express();
// const port = 3000;

// let bundle = null;
// let result = null;

// rollup.watch({
//   ...rollupConfig,
//   output: {
//     ...rollupConfig.output,
//     dir: './dist'
//   }
// }).on('event', async (event) => {
//   if (event.code === 'END') {
//     const bundle = await rollup.rollup(rollupConfig);
//     const { output } = await bundle.generate(rollupConfig.output);
//     result = output[0].code;

//     // Write to a file so it can be served or used later
//     fs.writeFileSync('./dist/bundle.js', result);
//   }
// });

// app.get('/poll', function (req, res) {
//   // Check if result is available
//   if (result) {
//     res.send(result);
//     result = null;
//   } else {
//     // Wait for the result to be available
//     const intervalId = setInterval(() => {
//       if (result) {
//         clearInterval(intervalId);
//         res.send(result);
//         result = null;
//       }
//     }, 500);
//   }
// });

// app.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`)
// });
