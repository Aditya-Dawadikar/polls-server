const mongoose = require('mongoose')

const user = mongoose.Schema({
    username:String,
    password:String,
    polls:[{
        name:String,
        options:[{
            name:String,
            count:Number
        }]
    }]
})

module.exports = mongoose.model('pollUser',user)