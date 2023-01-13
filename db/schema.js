const {gql} = require('apollo-server');

//Schema
const typeDefs = gql`
    type Asesor{
        id:ID
        nombre:String
        apellido:String
        email:String
        creado:String
        ciudad:String
    }

    type Alumno{
        id:ID
        nombre:String
        apellido:String
        edad:Int
        telefono:String
        nivel:Int
        asesor:ID
    }

    type Token{
        token:String
    }

    type Avance{
        id:ID
        nombre:String
        apellido:String
        nivel:Int
    }

    input AsesorInput{
        nombre:String!
        apellido:String!
        email:String!
        ciudad:String!
        password:String!
    }

    input AlumnoInput{
        nombre:String
        apellido:String
        edad:Int
        telefono:String
        nivel:Int
    }

    input AuthAsesorInput{
        email:String
        password:String
    }

    input AuthAlumnoInput{
        nombre:String
        apellido:String
    }

    input AvanceInput{
        nombre:String
        apellido:String
        nivel:Int
    }
    

    type Query{
        obtenerAsesor:Asesor
        obtenerAsesores:[Asesor]
        obtenerAlumno(id:ID):Alumno
        obtenerAlumnos:[Alumno]
        obtenerAlumnos_Asesor:[Alumno]
    }

    type Mutation{
        #Asesores
        nuevoAsesor(input:AsesorInput):Asesor
        autenticarAsesor(input:AuthAsesorInput):Token

        #alumnos
        nuevoAlumno(input:AlumnoInput):Alumno
        autenticarAlumno(input:AuthAlumnoInput):Token
        actualizarAlumno(id:ID!,input:AlumnoInput):Alumno
        eliminarAlumno(id:ID):String

        #Avances
        #nuevoAvance(input:AvanceInput):Avance
        actualizarAvance(id:ID!,input:AvanceInput):Alumno

    }

`

module.exports = typeDefs;