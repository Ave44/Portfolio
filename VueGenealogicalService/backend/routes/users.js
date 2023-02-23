const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
require('dotenv').config()

const User = require('../models/User')

router.get('/', async (req, res) => {
    User.find()
    .then(users => {
        res.send(users)
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

    User.findById(id)
    .then(user => {
        if (user){
            return res.send(user)
        } else {
            return res.status(404).send({error: `User with id ${id} not found`})
        }
    })
    .catch (err => {
        res.status(500).send(err)
    })
})

router.put('/:userId', async (req, res) => {
    const id = req.params.userId

    const name = req.body.name
    const surname = req.body.surname
    const login = req.body.login
    const password = req.body.password
    const birthDate = req.body.birthDate

    if(!name || !surname || !login || !password) {
        return res.status(400).send({error: "Missing querry data"})
    }
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({error: `Invalid id (passed: ${id})`})
    }

    const hash = generateHash(password)
    const user = {name, surname, login, password: hash, birthDate}

    User.findByIdAndUpdate(id, user, {new: true})
    .then(user => {
        if (user){
            res.send(user)
        } else {
            res.status(404).send({error: `User with id ${id} not found`})
        }
    })
    .catch (err => {
        res.status(500).send(err)
    })
})

router.delete('/:userId', async (req, res) => {
    const id = req.params.userId

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({error: `Invalid id (passed: ${id})`})
    }

    User.findByIdAndDelete(id)
    .then(result => {
        res.status(204).send(result)
    })
    .catch(err => {
        res.status(500).send(err)
    })
})

module.exports = router