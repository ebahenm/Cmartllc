// scripts/seedDriver.js
require('dotenv').config();
const mongoose = require('mongoose');
const Driver   = require('../server/models/Driver');

;(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
    dbName:             'Cmartllc'
  });

  const phone = '15133494031';
  let driver = await Driver.findOne({ phone });
  if (!driver) {
    driver = await Driver.create({
      name:     'Lemin',
      phone,
      email:    'mohamed.lemine.bhn@gmail.com',
      password: '$2b$10$0o5XPrUVJp4KtL3UwzwOMOrQ7/sbOd5Y6rMhlkYAS7SsN6DEdSlq.',  
      carrier:  'verizon'
    });
    console.log('Created driver:', driver);
  } else {
    console.log('Driver already exists:', driver);
  }

  process.exit(0);
})();
