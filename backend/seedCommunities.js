const mongoose = require('mongoose');
const Community = require('./src/models/community'); // adjust path
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function seed() {
  await Community.deleteMany(); // clear old data if needed

  const india = await Community.create({ name: "India", description: "Main hub for Indian discussions" });
  const jk = await Community.create({ name: "J&K", description: "All about Jammu & Kashmir", parent: india._id });
  const jammu = await Community.create({ name: "Jammu", description: "City of Temples", parent: jk._id });

  console.log("✅ Communities seeded:", india.name, jk.name, jammu.name);
  mongoose.connection.close();
}

seed();
