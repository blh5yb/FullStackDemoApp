import * as mongoose from 'mongoose';
const connectionString = process.env.ATLAS_URI || "";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  } catch (err) {
    console.error(`Mongo Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDb;