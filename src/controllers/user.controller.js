import {pool} from '../db/database.js'
import jwt_decode from 'jwt-decode'

//para listar todos los empleados 
export const getUsers = async (req, res) => {

    try {

        const [rows] = await pool.query('SELECT * FROM usuarios')
        res.json(rows)

    } catch (error) {

        return res.status(400).json({
            message: "error consulta mire la peticion o la conexion de DB"
        })

    }
}
// const token = req.headers.authorization.split(' ')[1];
// para listar solo un empleado
export const getUserLogin = async (req, res) => {

    try {

        const token = req.headers.authorization.split(' ')[1];
        //const token = req.headers['x-access-token'];
        const decoded = jwt_decode(token)

        const [rows] = await pool.query('SELECT nameUser FROM Usuarios WHERE id_user = ?', [decoded.id]) //calor que se obtine de la url
        if (rows.length <= 0) return res.status(404).json({
            message: 'ERROR'
        })
        res.json(rows[0])

    } catch (error) {

        return res.status(400).json({
            message: "error consulta"
        })

    }
}
// para listar solo un empleado
export const getUser = async (req, res) => {

    try {

        const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [req.params.id]) //calor que se obtine de la url
        if (rows.length <= 0) return res.status(404).json({
            message: 'ERROR'
        })
        res.json(rows[0])

    } catch (error) {

        return res.status(400).json({
            message: "error consulta"
        })

    }
}

/*export const createUsers = async (req, res) => {

    const [result] = await pool.query('SELECT * FROM rol')
    let role = result[1].id_rol;

    const {name, password} = req.body // de la pericion traigame solo dos datos
    
    try {

        const [rows] = await pool.query('INSERT INTO usuarios(name, password, id_rol) VALUES (?, ?, ?)', [name, password, role]) // de la peticion recupera dos valores, aca se los pasa a la consulta NOTA: el VALUES (?, ?) es de la libreria de mysql
        // el const [rows] es para q despues de la consulta guarde las columnas
    
        res.send({
            id: rows.insertId,
            name,
            password,
            role
        }) // para mandar los q responde lo de la base de datos al servidor y mandarlo al cliente (browser)
        
    } catch (error) {
        return res.status(500).json({
            message: "error consulta"
        })
    }
}*/

export const deleteUser = async (req, res) => {

    try {

        const [results] = await pool.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]) //valor que se obtine de la url y devuelve una arreglo mandado por la db
        if (results.affectedRows <= 0) return res.status(404).json({// se mira si fue afectado algun dato fue efectiva el metodo si no pailas
            message: 'ERROR'
        })
        res.sendStatus(204)

    } catch (error) {
        return res.status(500).json({
            message: "error consulta"
        })
    }
}

export const updateUser = async(req, res) => {
    const {id} = req.params // recuperar el id de la ruta
    const {name, password, id_rol} = req.body // de lap peticion recupereme los datos

    try {

        // query de editar, con IFNULL es para editar el valor q se le envia o mantener el actual
        const [result] = await pool.query('UPDATE usuarios SET name = IFNULL(?, name), password = IFNULL(?, password), id_rol = IFNULL(?, id_rol) WHERE id = ?', [name, password, id_rol, id])
    
        // condicinal para saber que funciona
        if(result.affectedRows === 0) return res.status(404).json({
            message: "Error a editar"
        })

        // como mostrar el elemento editado
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id])

        res.json(rows[0])

    } catch (error) {
        return res.status(500).json({
            message: "error consulta"
        })
    }

}