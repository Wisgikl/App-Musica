const {Schema,model} = require("mongoose")

const albumSchema = Schema({
    title   :{
        type:String,
        required:true
    },
    artist:{
        type:Schema.ObjectId,
        ref:"Artist"
    },
    year:{
        type:Number,
        required:true
    },
    description:{
        type:String
    },
    image:{
        type:String,
        default:"default.png"
    }
})
module.exports=model("Album",albumSchema,"albums")