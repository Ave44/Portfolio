const express = require('express')
const http = require("http")
const app = express()
const server = http.createServer(app)
const { Server } = require("socket.io")
const cors = require('cors')
const people = require('./routes/people')
const relations = require('./routes/relations')
const users = require('./routes/users')
const unprotected = require('./routes/unprotected')
const chats = require('./routes/chats')
require('dotenv').config()

app.use(express.json())
app.use(cors())

// Passport
const passport = require('passport')
require('./config/passport')(passport)
app.use(passport.initialize())

// Neo4j
try {
    require('./config/neo4jDriver')
    app.use('/people', passport.authenticate('jwt', {session: false}), people)
    app.use('/people/relations', passport.authenticate('jwt', {session: false}), relations)
    console.log(`Connected to Neo4J`)
} catch(err) {
    console.error('Error connecting to Neo4J', err)
}

// MongoDB
try {
    require('./config/mongoConfig')
    app.use('/unprotected', unprotected)
    app.use('/users', passport.authenticate('jwt', {session: false}), users)
    app.use('/chats', passport.authenticate('jwt', {session: false}), chats)
    console.log(`Connected to MongoDB`)
} catch(err) {
    console.error('Error connecting to MongoDB', err)
}

// socket.io
const io = new Server(server, {cors: {origin: "*"}})

io.on('connection', (socket) => {
    console.log('✅ Socket.io: połączono  id:', socket.id)

    socket.on("global", (data) => {
        console.log("global", data)
        io.emit("global", data)
    })

    socket.on("addChanels", (data) => {
        console.log(data)
        createChanels(data.userId, socket)
    })

    socket.on("newChanel", (data) => {
        // console.log(data)
        createChanel(socket, data.channelName)
    })

    socket.on("disconnect", () => {
        console.log("❌ Socket.io: rozłączono id:", socket.id)
    })

    socket.on("error", (err) => {
        console.dir(err)
    })
})

const Chat = require('./models/Chat')
const createChanels = (userId, socket) => {
    Chat.find({members: {$all: [userId]}})
    .then(chat => {
        if (chat){
            chanels = chat.map(chat => chat._id.toString())
            for(const chanel of chanels) {
                createChanel(socket, chanel)
            }
        } else { return console.log(`chat with id ${id} not found`) }
    })
    .catch (err => { console.dir(err) })
}

const createChanel = (socket, channelName) => {
    console.log(`created chanel: '${channelName}' for '${socket.id}'`)
    socket.on(channelName, (data) => {
        console.log(channelName, data)
        io.emit(channelName, data)
    })
}

const port = process.env.PORT || 5000
server.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`)
})