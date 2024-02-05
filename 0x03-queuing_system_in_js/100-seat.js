import { createClient } from 'redis';
import request from 'request';

const express = require('express');
const { promisify } = require('es6-promisify');
const kue = require('kue');

const app = express();
promisify(createClient);
const client = createClient();
let reservationEnabled = true;

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

const queue = kue.createQueue();

async function getCurrentAvailableSeats() {
  return new Promise((resolve) => {
    client.get('available_seats', (err, result) => {
      if (result === null) {
        resolve(0);
      } else {
        resolve(result);
      }
    });
  });
}

app.get('/available_seats', (req, res) => {
  getCurrentAvailableSeats()
    .then((seats) => {
      res.send({ numberOfAvailableSeats: seats });
    });
});

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    res.send({ status: 'Reservation are blocked' });
    return;
  }
  const job = queue.create('reserve_seat')
    .save((err) => {
      if (!err) {
        res.send({ status: 'Reservation in process' });
        request.get('http://127.0.0.1:1245/process');
      } else {
        res.send({ status: 'Reservation failed' });
      }
    });
  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  })
    .on('failed', (err) => {
      console.log(`seat reservation job ${job.id} failed: ${err.toString()}`);
    });
});

app.get('/process', (req, res) => {
  queue.process('reserve_seat', (job, done) => {
    getCurrentAvailableSeats()
      .then(async (seats) => {
        if (seats == 0) {
          reservationEnabled = false;
        }
        const newSeats = seats - 1;
        if (newSeats >= 0) {
          await client.set('available_seats', newSeats);
          done();
        } else {
          done(new Error('Not enough seats available'));
        }
      });
  });
  res.send({ status: 'Queue processing' });
});

app.listen(1245, '127.0.0.1', () => {
  console.log('Api listening on localhost port 1245');
  client.set('available_seats', 50);
});
