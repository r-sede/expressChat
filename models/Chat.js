var mongoose = require('mongoose');
var ChatSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created_at: {
        type:Date,
        default: Date.now
    }
});

var Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;