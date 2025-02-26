import express from "express"
import dotenv from "dotenv"
import dbConnect from "./DB/dbConnect.js"
import authRouter from "./route/authUser.js"


const app = express();  // create an express app

dotenv.config();  // configure dotenv to use .env file

app.use(express.json());  // use express to parse json

app.use('/api/auth', authRouter);  // use the authRouter for /api/auth

app.get("/", (req, res) => {
    res.send("Hello World!");  // send a response to the request
});

const PORT = process.env.PORT || 3000;  // set the port to the environment port or 3000

app.listen(PORT, () => {
    dbConnect();  // connect to the database
    console.log(`server started on ${PORT}`);
});  // start the server on port 3000