const mongoose = require('mongoose');

const AlumnoSchema = mongoose.Schema({
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
    edad:{
        type:Number,
        required:true,
        trim:true,
    },
    telefono:{
        type:String,
        // required:false,
        trim:true,
        // unique:false
    },
    nivel:{
      type:Number,
      trim:true  
    },
    creado:{
        type:Date,
        default:Date.now()
    },
    asesor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Asesores'
    },


});

module.exports = mongoose.model('Alumno',AlumnoSchema);