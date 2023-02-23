const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    surname: {
        type: String,
        required: [true, "Surame is required"]
    },
    login: {
        type: String,
        required: [true, "Login is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    birthDate: {
        type: String
    }
})

userSchema.methods.validatePassword =  function (password) {
    return new Promise((resolve, reject) => {
        if (bcrypt.compareSync(password, this.password)) {
            resolve(true)
        } else {
            reject("Incorrect password")
        }
    })
}

module.exports = model('User', userSchema)