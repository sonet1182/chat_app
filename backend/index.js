import express from "express"
import dotenv from "dotenv"
import dbConnect from "./DB/dbConnect.js"
import authRouter from "./route/authUser.js"
import messageRouter from "./route/messageRoute.js"
import userRouter from "./route/userRoute.js"
import cookieParser from "cookie-parser"
import {app, server} from './socket/socket.js'

dotenv.config();  // configure dotenv to use .env file

app.use(express.json());  // use express to parse json
app.use(cookieParser());  // use cookie parser to parse cookies  

app.use('/api/auth', authRouter);  // use the authRouter for /api/auth
app.use('/api/message', messageRouter);  // use the authRouter for /api/message
app.use('/api/user', userRouter);  // use the authRouter for /api/message

app.get("/", (req, res) => {
    res.send("Hello World!");  // send a response to the request
});

const PORT = process.env.PORT || 3000;  // set the port to the environment port or 3000

server.listen(PORT, () => {
    dbConnect();  // connect to the database
    console.log(`server started on ${PORT}`);
});  // start the server on port 3000