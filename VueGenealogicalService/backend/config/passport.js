const User = require('../models/User')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
require('dotenv').config()

const secret = process.env.SECRET || 's3cr33t6p3l7s02n'

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}

const strategy = new JwtStrategy(options, (payload, done) => {
    User.findById(payload.sub)
    .then(user => {
        if(user) {
            return done(null, user)
        }
        return done(null, false)
    })
    .catch(err => {
        done(err, null)
    })
})

module.exports = (passport) => {
    passport.use(strategy)
}