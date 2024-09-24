// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;


const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 5;  // Maximum number of retry attempts
  let retries = 0;
  
  const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected');
    } catch (error) {
      retries += 1;
      console.error(`MongoDB connection error (attempt ${retries}):`, error);
      if (retries < maxRetries) {
        console.log(`Retrying in ${retries * 2} seconds...`);
        setTimeout(connect, retries * 2000);  // Exponential backoff
      } else {
        console.error('Max retries reached. Exiting...');
        process.exit(1);  // Exit the process after max retries
      }
    }
  };

  connect();
};

module.exports = connectDB;
