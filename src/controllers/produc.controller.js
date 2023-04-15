import {pool} from '../db/database.js'

//para listar todos los productos 
export const getProducs = async (req, res) => {

    try {

        const [rows] = await pool.query('SELECT * FROM productos')
        res.json(rows)

    } catch (error) {

        return res.status(500).json({
            message: "error consulta mire la peticion o la conexion de DB"
        })

    }
}
// para listar solo un empleado
export const getProduc = async (req, res) => {

    try {

        const [rows] = await pool.query('SELECT * FROM productos WHERE id_productos = ?', [req.params.id]) //calor que se obtine de la url
        if (rows.length <= 0) return res.status(404).json({
            message: 'ERROR'
        })
        res.json(rows[0])

    } catch (error) {

        return res.status(500).json({
            message: "error consulta"
        })

    }
}

export const createProducs = async (req, res) => {

    const {name, categorya, precio, imgURL} = req.body // de la pericion traigame solo dos datos
    
    try {

        const [rows] = await pool.query('INSERT INTO productos(name, categorya, precio, imgURL) VALUES (?, ?, ?, ?)', [name, categorya, precio, imgURL]) // de la peticion recupera dos valores, aca se los pasa a la consulta NOTA: el VALUES (?, ?) es de la libreria de mysql
        // el const [rows] es para q despues de la consulta guarde las columnas
        console.log(rows);

        res.send({
            id: rows.insertId,
            name,
            categorya,
            precio,
            imgURL
        }) // para mandar los q responde lo de la base de datos al servidor y mandarlo al cliente (browser)
        
    } catch (error) {
        return res.status(400).json({
            message: "error consultaaaaaaaaa"
        })
    }
}

export const deleteProduc = async (req, res) => {

    try {

        const [results] = await pool.query('DELETE FROM productos WHERE id_productos = ?', [req.params.id]) //valor que se obtine de la url y devuelve una arreglo mandado por la db
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

export const updateProduc = async(req, res) => {
    const {id} = req.params // recuperar el id de la ruta
    const {name, categorya, precio, imgURL} = req.body // de lap peticion recupereme los datos

    try {

        // query de editar, con IFNULL es para editar el valor q se le envia o mantener el actual
        const [result] = await pool.query('UPDATE productos SET name = IFNULL(?, name), categorya = IFNULL(?, categorya), precio = IFNULL(?, precio), imgURL = IFNULL(?, imgURL) WHERE id_productos = ?', [name, categorya, precio, imgURL, id])
    
        // condicinal para saber que funciona
        if(result.affectedRows === 0) return res.status(404).json({
            message: "Error a editar"
        })

        // como mostrar el elemento editado
        const [rows] = await pool.query('SELECT * FROM productos WHERE id_productos = ?', [id])

        res.json(rows[0])

    } catch (error) {
        return res.status(500).json({
            message: "error consulta"
        })
    }

}