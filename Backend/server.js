import express from 'express';
import mongoose from "mongoose";
import cors from "cors";
import 'dotenv/config';
import router from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: [
      "http://localhost:5000",         // local frontend
      "https://smartgpt-miax.onrender.com"   // deployed frontend
    ], // Allow requests from your frontend
    methods: ['GET', 'POST', 'DELETE', 'PUT'], // Specify allowed methods
    credentials: true // Allow credentials if needed
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api",router);

const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.Mongo);
        console.log("Connected to MongoDB");
    }catch(err){
        console.log("Error connecting to MongoDB",err);
    }
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});

/*key=AIzaSyCWoW7dDmvBMpqbrZjUJrubbDNh068v7Zg
Mongo=mongodb+srv://admin:admin@cluster0.zq8uvts.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
*/
