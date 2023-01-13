const Asesores = require('../models/Asesores');
const Alumnos = require('../models/Alumnos');
const Avances = require('../models/Avances');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require ('dotenv').config({path:'variables.env'});

const crearToken = (usuario, secreta, expiresIn)=>{
    // console.log(usuario);
    const {id, email,nombre,apellido} = usuario;

    return jwt.sign({id,nombre,apellido}, secreta, {expiresIn});
}

//resolvers
const resolvers = {
    Query:{
        obtenerAsesor: async (_,{}, ctx)=>{
            try {
                return ctx.usuario
            } catch (error) {
                throw new Error ('No hay asesores inscritos');
            }
            
        },
        obtenerAsesores: async ()=>{
            try {
                const asesor = await Asesores.find({});
                return asesor    
            } catch (error) {
                throw new Error ('No hay asesores inscritos');
            }
            
        },
        obtenerAlumno: async (_,{id})=>{
            try {
                const alumno = await Alumnos.findById(id);
                return alumno;
            } catch (error) {
                throw new Error ('No existe el alumno');
            }
            
        },
        obtenerAlumnos: async ()=>{
            try {
                const alumnos = await Alumnos.find({});
                return alumnos    
            } catch (error) {
                throw new Error ('No hay asesores inscritos');
            }
            
        },
        obtenerAlumnos_Asesor :async (_,{},ctx)=>{
            try {
                const alumnos = await Alumnos.find({asesor:ctx.usuario.id.toString()});
                console.log(alumnos);
                return alumnos;
            } catch (error) {
                console.log(error) ;
            }
        },
        
    },
    
    Mutation:{
        nuevoAsesor:async(_,{input})=>{
            console.log(input);
            const {email, password} = input;
            //revisar si el usuario eno esta registrado
            const existeAsesor = await Asesores.findOne({email});
            console.log(existeAsesor);

            if (existeAsesor) {
                throw new Error ('El asesor ya esta inscrito');
            }
            //Contraseña
            const salt = await bcryptjs.genSaltSync(10);
            input.password = await bcryptjs.hashSync(password,salt);

            try {
                //Guardar en la base de datos
                const asesor = new Asesores(input);
                asesor.save(); //guardarlo
                return asesor;
            } catch (error) {
                console.log(error);
            }
        },
        
        autenticarAsesor:async(_,{input})=>{
            const {email, password} = input

            //Si el usuario existe
            const existeAsesor = await Asesores.findOne({email});
            if(!existeAsesor){
                throw new Error ('El usuario no existe');
            }

            //Contraseña correcta
            const passwordCorrecto = await bcryptjs.compare( password, existeAsesor.password);
            if (!passwordCorrecto){
                throw new Error ('La contraseña es incorrecta');
            }
            //Crear token
            return {
                token: crearToken(existeAsesor, process.env.SECRETA, '24h')
            };
        },
        nuevoAlumno:async(_,{input},ctx)=>{
            const {nombre, apellido, nivel} = input;
            //revisar si el alumno ya esta registrado
            const existeALumno = await Alumnos.findOne({nombre,apellido});

            if (existeALumno) {
                throw new Error ('El alumno ya esta inscrito');
            }
            const nuevoAlumno = new Alumnos(input);
            //asignar asesor
            nuevoAlumno.asesor = ctx.usuario.id;
            
            //crear avances de alumno
            const nuevoAvance = await Avances({nombre, apellido, nivel});
            nuevoAvance.asesor = ctx.usuario.id;

            //guardar en la base de datos
            try {
                //Guardar en la base de datos
                await nuevoAvance.save();
                const alumno = await nuevoAlumno.save();
                return alumno;
            } catch (error) {
                console.log(error);
            }

        },
        autenticarAlumno:async(_,{input})=>{
            const {nombre, apellido} = input

            //Si el usuario existe
            const existeAlumno = await Alumnos.findOne({nombre:nombre,apellido:apellido});
            if(!existeAlumno){
                throw new Error ('El usuario no existe');
            }
            return {
                token: crearToken(existeAlumno, process.env.SECRETA, '24h')
            };
        },
        actualizarAlumno:async (_,{id,input},ctx)=>{
            //Verificar si existe o no
            let alumno = await Alumnos.findById(id);
            if (!alumno) {
                throw new Error ('No existe el alumno');
            }
            //verificar si el asesor es quien edita
            if (alumno.asesor.toString() !== ctx.usuario.id) {
                throw new Error ('No tienes las credenciales');
            }
            //guardar el cliente
            alumno = await Alumnos.findOneAndUpdate({_id:id}, input,{new:true});
            return alumno;
        },
        eliminarAlumno:async (_,{id},ctx)=>{
            //Verificar si existe o no
            let alumno = await Alumnos.findById(id);

            if(!alumno){
                throw new Error ('Este alumno no existe');
            }

            //Verificar si es el asesor quien edita
            if(alumno.asesor.toString()!==ctx.usuario.id ){
                throw new Error ('No tienes las credenciales');
            }
            //eliminar el alumno
            await Alumnos.findOneAndDelete({_id:id});
            return 'Alumno Eliminado';
        },
        actualizarAvance:async (_,{id,input},ctx)=>{
            //Verificar si existe o no
            let avance = await Avances.findById(id);
            if (!avance) {
                throw new Error ('No existe el Avance');
            }
            //verificar si el asesor es quien edita
            if (avance.asesor.toString() !== ctx.usuario.id) {
                throw new Error ('No tienes las credenciales');
            }
            //guardar el cliente
            avance = await Avances.findOneAndUpdate({_id:id}, input,{new:true});
            return avance;
        },
    }
};
module.exports = resolvers;
