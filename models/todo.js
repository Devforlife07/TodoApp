const mongooose = require("mongoose")
const Schema = mongooose.Schema;
const todoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongooose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})
module.exports = mongooose.model("Todo", todoSchema);