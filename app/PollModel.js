const mongoose = require('mongoose')

const user = mongoose.Schema({
    username:String,
    password:String,
    polls:[{
        name:String,
        options:[{
            name:String,
            count:Number
        }],
        voters:[mongoose.Types.ObjectId]
    }],
})

module.exports = mongoose.model('pollUser',user)