import express from "express"
import cors from "cors"
import dotenv from 'dotenv'
import connectDB from "./Database/config.js"
import userRouter from './Routers/userRouter.js'
import serviceRouter from './Routers/serviceRouter.js'
import chatRouter from './Routers/chatRouter.js'
import appoinmentRouter from './Routers/appoinmentRouter.js'
import {createServer} from 'http'
import { Server } from "socket.io"

// express setup
dotenv.config()
const port = process.env.PORT
const app = express()
const server = createServer(app)

// socket.io
const io = new Server(server, {
    cors: {
      origin: 'https://artlinqfe.vercel.app', 
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

// middlewares
app.use(express.json())
app.use(cors())

// DB connect
connectDB()


// websocket setup
io.on("connection",(socket)=>{
    console.log("Socket Connected")

    socket.on("chat message",(msg)=>{
        console.log('msg',msg)
        io.emit('chat message', msg)
    })

    socket.on('disconnect',()=>{
        console.log("user Disconnected")
    })
})

// routes 
app.use('/api/user', userRouter)
app.use('/api/service', serviceRouter)
app.use('/api/chats',chatRouter)
app.use('/api/appoinments', appoinmentRouter)
server.listen(port,()=>{
    console.log("Server initiated")
})
