import { createClient } from 'redis';

const express = require('express');
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

const listProducts = [
  {
    itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4,
  },
  {
    itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10,
  },
  {
    itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2,
  },
  {
    itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5,
  },
];

function getItemById(id) {
  const product = listProducts.filter((value) => value.itemId === id);
  if (product.length > 0) {
    return product[0];
  }
  return null;
}

const app = express();

app.get('/list_products', (req, res) => {
  res.send(listProducts);
});

function reserveStockById(itemId, stock) {
  client.set(itemId, stock);
}

async function getCurrentReservedStockById(itemId) {
  return new Promise((resolve) => {
    client.get(itemId, (err, result) => {
      if (result === null) {
        resolve(0);
      } else {
        resolve(Number(result));
      }
    });
  });
}

app.param('itemId', (req, res, next, id) => {
  req.itemId = Number(id);
  next();
});

app.get('/list_products/:itemId', async (req, res) => {
  const id = req.itemId;
  getCurrentReservedStockById(id)
    .then((stock) => {
      const item = getItemById(id);
      if (item) {
        item.currentQuantity = item.initialAvailableQuantity - stock;
        res.send(item);
      } else {
        res.send({ status: 'Product not found' });
      }
    });
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const id = req.itemId;
  const item = getItemById(id);
  if (!item) {
    res.send({ status: 'Product not found' });
  } else {
    const stock = await getCurrentReservedStockById(id);
    if (stock < item.initialAvailableQuantity) {
      reserveStockById(id, stock + 1);
      res.send({ status: 'Reservation confirmed', itemId: id });
    } else {
      res.send({ status: 'Not enough stock available', itemId: id });
    }
  }
});

app.listen(1245, '127.0.0.1', () => {
  console.log('Api listening on localhost port 1245');
});
