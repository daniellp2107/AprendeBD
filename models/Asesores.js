const mongoose = require('mongoose');

const AsesorSchema = mongoose.Schema({
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    apellido:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    creado:{
        type:Date,
        default:Date.now()
    },
    ciudad:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    }


});

module.exports = mongoose.model('Asesor',AsesorSchema);