const {Schema,model} = require("mongoose")

const songSchema = Schema({
    title:{
        type:String,
        required:true
    },
    album:{
        type:Schema.ObjectId,
        ref:"Album"
    },
    track:{
        type:Number,
        required:true
    },
    file:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
})
module.exports=model("Song",songSchema, "songs")