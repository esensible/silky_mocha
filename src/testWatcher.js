import chokidar from 'chokidar';
import { rollup, watch } from 'rollup';
import fs from 'fs';
import { EventEmitter } from 'events';
import path from 'path';

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


  async createRollupWatcher(file) {
    const userRollupConfigPath = path.join(process.cwd(), 'rollup.config.js');

    var baseRollupConfig = {}
    if (fs.existsSync(userRollupConfigPath)) {
        baseRollupConfig = await import(userRollupConfigPath);
        if (typeof baseRollupConfig.default !== "undefined") {
            baseRollupConfig = baseRollupConfig.default;
        }
    }
  
    const watchOptions = {
      ...baseRollupConfig,
      input: file,
      output: {
        ...baseRollupConfig.output,
        file: `./.test/${file}`
      }
    };

    const watcher = watch(watchOptions);

    watcher.on('event', async (event) => {
      try {
        if (event.code === 'END') {
          const bundle = await rollup(watchOptions);
          const { output } = await bundle.generate(watchOptions.output);
        //   output.forEach((item) => {
        //     if (item.type === 'asset' && item.fileName.endsWith('.css')) {
        //       console.log('CSS file generated:', item.fileName);
        //     }
        //   });
          let fileDict = {
            test: `.test/${file}`
          };
          output.forEach((item) => {
            if (item.type === 'asset') {
              let ext = item.fileName.split('.').pop();
              fileDict[ext] = `.test/test/${item.fileName}`;
            }
          });
          this.emit('test', fileDict);
        }

        // if (event.code === 'START') {
        //   console.log(`Bundling ${file}...`);
        // }

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
