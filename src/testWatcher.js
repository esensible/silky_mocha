import chokidar from 'chokidar';
import { rollup, watch } from 'rollup';
import rollupConfig from './rollup.config.js';
import fs from 'fs';
import { EventEmitter } from 'events';

class TestWatcher extends EventEmitter {
  constructor(testFilesGlob) {
    super();
    this.testFilesGlob = testFilesGlob;

    this.watcher = chokidar.watch(this.testFilesGlob, {
      persistent: true,
      ignoreInitial: false
    });

    this.watcher.on('add', filePath => {
      this.createRollupWatcher(filePath);
    });
  }

  createRollupWatcher(file) {
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
          this.emit('test', file);
        }

        if (event.code === 'START') {
        //   console.log(`Bundling ${file}...`);
        }

        if (event.code === 'ERROR') {
          console.error(`Error bundling ${file}:`, event.error);
        }
      } catch (err) {
        console.error(`Error during Rollup bundling process for ${file}:`, err);
      }
    });
  }
}

export default TestWatcher;
