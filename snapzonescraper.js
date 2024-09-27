const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const Card  = require('./schemas/card');
require('dotenv').config();


async function main() {
try {
  await mongoose.connect(process.env.MONGO_URL_DB, {
    serverSelectionTimeoutMS: 5000,
  })
  const browser = await puppeteer.launch({
    dumpio: true,
  });
   const collectionExists = (await mongoose.connection.db.listCollections().toArray()).length > 0
  
   if (collectionExists) {
      Card.collection.drop()
    }
    const page = await browser.newPage();
    await page.goto(process.env.MARVEL_SNAP_ZONE_CARDS_URL);
    const cards = await page.evaluate(() => {
        const cardsContainersList = document.querySelectorAll('.simple-card')
        const cardsContainers = [...cardsContainersList]
        const cardsInfo = cardsContainers.map(card => ({
          id: card.getAttribute('data-cid'),
          name: card.querySelector('.cardname').innerText,
          ability: card.querySelector('.card-description').innerText,
          image: card.querySelector('img.active').getAttribute('data-src'),
          power: card.getAttribute('data-power'),
          cost: card.getAttribute('data-cost'),
        }))
        return cardsInfo
      })
    await browser.close();
    await Card.insertMany(cards)
    console.log('\x1b[36m%s\x1b[0m', 'Collection updated'); 
    process.exit(0)
} catch (error) {
  console.log("\x1b[31m",error)
}
}
main();