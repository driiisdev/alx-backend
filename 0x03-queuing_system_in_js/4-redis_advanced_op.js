import { createClient, print } from 'redis';

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

client.hset('HolbertonSchools', 'Portland', 50, print);
client.hset('HolbertonSchools', 'Seattle', 80, print);
client.hset('HolbertonSchools', 'New York', 20, print);
client.hset('HolbertonSchools', 'Bogota', 20, print);
client.hset('HolbertonSchools', 'Cali', 40, print);
client.hset('HolbertonSchools', 'Paris', 2, print);

client.hgetall('HolbertonSchools', (err, reply) => {
  console.log(reply);
});
