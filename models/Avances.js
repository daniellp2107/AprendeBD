const mongoose = require('mongoose');

const AvancesSchema = mongoose.Schema({
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
    nivel:{
        type:Number,
        required:true,
        trim:true
    },
    asesor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Asesores'
    },
});

module.exports = mongoose.model('Avances',AvancesSchema);