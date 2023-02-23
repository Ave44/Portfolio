const express = require('express')
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const router = express.Router()
require('dotenv').config()

const User = require('../models/User')
const secret = process.env.SECRET || 's3cr33t6p3l7s02n'

const generateHash = (password) => {
    const min = 8
    const max = 12
    const saltSeed = Math.floor(Math.random() * (max - min + 1) + min)
    const salt = bcrypt.genSaltSync(saltSeed)
    const hash = bcrypt.hashSync(password, salt)
    return hash
}

const issueJWT = (user) => {
    const _id = user._id
    const expiresIn = '1d'
    const payload = {
        sub: _id,
        iat: Date.now()
    }
    const signedToken = jsonwebtoken.sign(payload, secret, {expiresIn: '1'})

    return {
        token: "Bearer " + signedToken,
        expires: expiresIn
    }
}

router.post('/', async (req, res) => {
    const name = req.body.name
    const surname = req.body.surname
    const login = req.body.login
    const password = req.body.password
    const birthDate = req.body.birthDate
    console.log("MONGO POST", {name, surname, login, password, birthDate})

    if(!name || !surname || !login || !password) {
        return res.status(400).send({error: "Missing querry data"})
    }

    const hash = generateHash(password)
    const user = new User({name, surname, login, password: hash, birthDate})
    user.save()
    .then(user => {
        const jwt = issueJWT(user)
        res.send({user, token: jwt.token, expires: jwt.expires})
    })
    .catch(err => {
        res.status(500).send(err)
    })
})

router.post('/login', async (req, res) => {
    const login = req.body.login
    const password = req.body.password

    if(!login || !password) {
        return res.status(400).send({error: "Missing querry data"})
    }

    User.findOne({ login: login})
    .then(user => {
        // console.log(user)
        if(user) {
            user.validatePassword(password)
            .then(result => {
                // console.log(result)
                const jwt = issueJWT(user)
                res.send({user, token: jwt.token, expires: jwt.expires})
                // res.send(user)
            })
            .catch(err => {
                console.log(err)
                res.status(401).send({error: err})
            })
        } else {
            res.status(404).send({error: `User with login "${login}" not found`})
        }
    })
    .catch(err => {
        res.status(500).send(err)
    })
})

module.exports = router