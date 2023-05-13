import {pool} from '../db/database.js'
import {encrypPassword, comparePassword} from '../libs/encrypt.js'
import config from '../config.js'
import jwt from 'jsonwebtoken'

export const crearUsuario = async (req, res) => {

    const [result] = await pool.query('SELECT * FROM roles') // hago la consulta y me trae una reglo
    let role = result[2].id_roles; // extraigo el dao que quiero

    let fechNacimiento = new Date()
    let creacion = new Date()
    let foto = 'aca va la url de la imagen '

    const {nameUser, cedula, password, email} = req.body // de la pericion traigame solo dos datos

    try {

        const encry = await encrypPassword(password) // ejecuto el algo de encriptar y se lo paso a la consulta 

        const [rows] = await pool.query('INSERT INTO Usuarios (nameUser, id_Number, birthDate, password, email, imagen, create_time, id_rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [nameUser, cedula, fechNacimiento, encry, email, foto, creacion, role]) // de la peticion recupera dos valores, aca se los pasa a la consulta NOTA: el VALUES (?, ?) es de la libreria de mysql
        // el const [rows] es para q despues de la consulta guarde las columnas

        const token = jwt.sign({id: rows.insertId}, config.SECRET_TOKENT,{
            expiresIn: 86400
        })

        /*res.send({
            id: rows.insertId,
            nameUser,
            cedula,
            fechNacimiento,
            password,
            email,
            foto,
            creacion,
            role,
            token
        }) // para mandar los q responde lo de la base de datos al servidor y mandarlo al cliente (browser)*/

        res.status(200).json({token})
        
    } catch (error) {
        return res.status(400).json({
            message: "error al crear ususario"
        })
    }
}
export const loguearse = async (req, res) => {

    const {email, password} = req.body // recoge de la peticion POST estos datos

    try {

        const [result] = await pool.query('SELECT id_user FROM Usuarios WHERE email = ?', [email]) // busca el id del usuario por el nombre
        if (result.length <= 0) return res.status(404).json({message: 'ERROR USUARIO NO ES ENCONTRADO'}) // pregunte si se encuentra o saque error
        let id = result[0].id_user // extraiga el id

        const [rows] = await pool.query('Select * from Usuarios Inner join roles On Usuarios.id_rol = roles.id_roles WHERE Usuarios.id_user = ?', [id])// consulte los elementos que tiene en relacion con otras tablas usando el ID 

        console.log(rows[0].name_rol);// prueba para sacar el String del rol asociado al ud del usuario

        const pass = await comparePassword(password, rows[0].password)// compara las password da la DB con las q ingreso y return un boolean

        //let message = 'ERROR CLAVE INCORRECTA'
        if(!pass) return res.status(401).json({message: 'ERROR CLAVE INCORRECTA'})// depende de que retorne aprueba o no la comparacion

        // se le asigna otra vez un token
        const token = jwt.sign({id: id, name: result[0].name}, config.SECRET_TOKENT,{
            expiresIn: 86400
        })

        // y esto devuelve la peticion el token
        return res.status(200).json({token})


    } catch (error) {
        return res.status(400).json({
            message: "error consulta Logueo"
        })
    }

}