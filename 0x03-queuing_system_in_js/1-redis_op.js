import { createClient, print } from 'redis';

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

function displaySchoolValue(schoolName) {
  if (schoolName) {
    client.get(schoolName, (err, reply) => {
      console.log(reply);
    });
  }
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
