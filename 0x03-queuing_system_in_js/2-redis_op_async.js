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

function setNewSchool(schoolName, value) {
  if (schoolName && value) {
    client.set(schoolName, value, print);
  }
}

async function displaySchoolValue(schoolName) {
  if (schoolName) {
    await client.get(schoolName, (err, reply) => {
      console.log(reply);
    });
  }
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
