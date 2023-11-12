import { connect } from "mongoose";
import { config } from 'dotenv';
config();

const url = process.env.DB_URL;

console.log(url);

const connectToDatabase = () => {
  connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(console.log("MongoDB successfully connected!")).catch(err => console.log(err))
}
export default connectToDatabase;