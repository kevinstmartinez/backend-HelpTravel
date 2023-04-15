import config from '../config.js'
import jwt from 'jsonwebtoken'
import {pool} from '../db/database.js'

// esto es para proteger las rutas 
// Verifica el token, y mira que rols tiene Autorizacion

// funcion que verifica si lo q se envia es un token valido
// next es para que cuando cupla si objetivo pase a la siguiente ruto o funcion 

export const verifyToken = async (req, res, next) => {
    const token = req.headers["x-access-token"]; // esto es lo que se le envia al cliente

    try {

        if(!token) return res.status(403).json({message: "No token provided"})// si no envia un token por el headers bote este mensaje 
        
        const decoder = jwt.verify(token, config.SECRET_TOKENT) // decodifica el token y extrae el id del ususario

        req.userId = decoder.id; // aca se le pone una propiedad nueva al req para q guarde el valor del id

        const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [req.userId]) // verifica si existe el usuario
        if (rows.length <= 0) return res.status(404).json({ message: 'no user found' })
    
        next() // para que continue con la siguiente ruta

    } catch (error) {
        return res.status(401).json({message: 'Unauthorized'})
    }
}

// para verificar los roles y darle sierto acceso a cada tarea 

export const isEmpleado = async (req, res, next) => {

    const [result] = await pool.query('Select * from usuarios Inner join rol On usuarios.id_rol = rol.id_rol WHERE usuarios.id = ?', [req.userId])
    if(result[0].name_rol === "empleado"){
        next()
    }else{
        return res.status(401).json({message: 'Usuario no permitido'})
    }
}


export const isAdmin = async (req, res, next) => {

    const [result] = await pool.query('Select * from usuarios Inner join rol On usuarios.id_rol = rol.id_rol WHERE usuarios.id = ?', [req.userId])
    if(result[0].name_rol === "admin"){
        next()
    }else{
        return res.status(401).json({message: 'Usuario no permitido'})
    }
}

export const isUser = async (req, res, next) => {

    const [result] = await pool.query('Select * from usuarios Inner join rol On usuarios.id_rol = rol.id_rol WHERE usuarios.id = ?', [req.userId])
    if(result[0].name_rol === "admin"){
        next()
    }else{
        return res.status(401).json({message: 'Usuario no permitido'})
    }
}