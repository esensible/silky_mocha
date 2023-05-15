import express from 'express';
import path from 'path';
import { EventEmitter } from 'events';
import { fileURLToPath } from 'url';

class TestServer extends EventEmitter {
  constructor() {
    super();
    this.clients = [];
    this.pendingTests = [];  // Store pending test events as an array
    this.app = express();
    this.app.use(express.text())

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    this.app.use(express.static(__dirname, { index: 'index.html', etag: false, maxAge: 0 }));

    // Serve static files from the `dist` directory in the user's project.
    // Assume the `dist` directory is in the current working directory.
    this.app.use('/.test', express.static(path.join(process.cwd(), '.test'), { etag: false, maxAge: 0 }));

    this.app.get('/test', (req, res) => {
      // console.log('New client connected');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Connection', 'keep-alive');
      this.clients.push(res);
    
      // Drain pending tests if any exist
      if (this.pendingTests.length > 0) {
        // Send only the first test from the array
        let testFile = this.pendingTests.shift();
        this.sendTestToClients(testFile);
      }
    });

    this.app.post('/log', (req, res) => {
      const message = req.body;
      console.log(message);
      this.emit('log', message);
      res.sendStatus(200);
    });

    this.on('test', (testFile) => {
      // If clients are connected, send the test immediately
      if (this.clients.length > 0) {
        this.sendTestToClients(testFile);
      } else {
        // If no clients are connected, store the test in the pending tests
        // Check if the testFile is already in the pendingTests array
        if (!this.pendingTests.includes(testFile)) {
          this.pendingTests.push(testFile);
        }
      }
    });
  }

  sendTestToClients(testFile) {
    console.log(`** ${testFile} **`)
    const response = {
      test: `/${testFile}?uuid=${this.uuid(4)}`,
    };
    this.clients.forEach((res) => {
      res.write(JSON.stringify(response));
      res.end();
    });
    this.clients = [];
  }

  uuid(length) {
    return Array.from({ length }, () => Math.random().toString(36)[2]).join('');
  }

  start() {
    this.app.listen(3000, '0.0.0.0', () => {
      console.log('Listening on port 3000');
    });
  }
}

export default TestServer;
