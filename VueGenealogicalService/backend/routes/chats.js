const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const Chat = require('../models/Chat')

router.get('/', async (req, res) => {
    Chat.find()
    .then(chats => {
        res.send(chats)
    })
    .catch(err => {
        res.status(500).send(err)
    })
})

router.get('/:userId', async (req, res) => {
    const id = req.params.userId

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({error: `Invalid id (passed: ${id})`})
    }

    Chat.find({members: {$all: [id]}}).populate('members')
    .then(chat => {
        if (chat){
            return res.send(chat)
        } else {
            return res.status(404).send({error: `chat with id ${id} not found`})
        }
    })
    .catch (err => {
        res.status(500).send(err)
    })
})

router.post('/', async (req, res) => {
    const members = req.body.members
    const history = []
    console.log("MONGO POST", {members})

    if(!members) {
        return res.status(400).send({error: "Missing querry data"})
    }

    const chat = new Chat({members, history})
    chat.save()
    .then(result => {
        Chat.findById(result._id).populate('members')
        .then(chat => { return res.send(chat) })
        .catch (err => { res.status(500).send(err) })
    })
    .catch(err => {
        res.status(500).send(err)
    })
})

router.put(`/:chatId`, async (req, res) => {
    const id = req.params.chatId
    const senderId = req.body.senderId
    const senderName = req.body.senderName
    const message = req.body.message

    if(!message || !senderId || !senderName) {
        return res.status(400).send({error: "Missing querry data"})
    }
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({error: `Invalid id (passed: ${id})`})
    }

    const data = {senderId, senderName, message}
    Chat.findById(id)
    .then(chat => {
        if (chat){
            chat.history.push(data)
            chat.save()
            .then(result => { res.send(result) })
            .catch(err => { res.status(500).send(err) })
        } else {
            return res.status(404).send({error: `chat with id ${id} not found`})
        }
    })
    .catch (err => {
        res.status(500).send(err)
    })
})

router.delete('/:chatId', async (req, res) => {
    const id = req.params.chatId
    
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({error: `Invalid id (passed: ${id})`})
    }

    Chat.findByIdAndDelete(id)
    .then(result => {
        res.status(204).send(result)
    })
    .catch(err => {
        res.status(500).send(err)
    })
})

module.exports = router