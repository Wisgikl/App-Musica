const {Schema,model} = require("mongoose")

const artistSchema = Schema({
    nick:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        type:String,
        default:"default.png"
    },
    
})
module.exports = model("Artist",artistSchema,"artists")