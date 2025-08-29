const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User"); // Adjust the path if your User model is elsewhere
require('dotenv').config();
// 1️⃣ Connect to your MongoDB
mongoose.connect(process.env.MONGO_URI, { // replace yourDBName
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// 2️⃣ Reset password function
async function resetPassword(username, newPassword) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.findOneAndUpdate(
      { username },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      console.log("User not found!");
    } else {
      console.log(`Password for "${username}" has been reset successfully!`);
    }

    mongoose.connection.close(); // close DB connection
  } catch (err) {
    console.error(err);
  }
}

// 3️⃣ Call the function with your username and new password
resetPassword("Vanshfired", "newPassword@123");
