const { Schema, model } = require('mongoose')

const chatSchema = new Schema({
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    history: {
        type: Array,
        required: [true, "History is required"]
    }
})

module.exports = model('Chat', chatSchema)