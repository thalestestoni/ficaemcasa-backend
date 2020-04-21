import mongoose from 'mongoose';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: true, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  connectTimeoutMS: 1000,
};

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    this.mongoConnection = mongoose
      .connect(process.env.MONGO_URL, options)
      .catch((error) => this.handleError(error));

    mongoose.connection.on('error', (err) => {
      this.logError(err);
    });
  }

  handleError(error) {
    console.log(error);
  }

  logError(error) {
    console.log(error);
  }
}

export default new Database();
