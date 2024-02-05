import { createClient } from 'redis';

const { promisify } = require('es6-promisify');

promisify(createClient);
const client = createClient();

new Promise((resolve, reject) => {
  client.on('error', (err) => {
    reject(err);
  });
  client.on('connect', () => {
    resolve();
  });
})
  .then(() => {
    console.log('Redis client connected to the server');
  })
  .catch((err) => {
    console.log(`Redis client not connected to the server: ${err.toString()}`);
  });

client.on('message', (channel, message) => {
  console.log(message);
  if (message === 'KILL_SERVER') {
    client.unsubscribe('holberton school channel');
    process.exit(0);
  }
});

client.subscribe('holberton school channel');
