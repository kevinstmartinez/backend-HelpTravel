import {createPool} from 'mysql2/promise'
//import {promisify} from 'util'
import {HOST, USER_DATABASE, PASSWORD, PORT_DATABASE, NAME_DATABASE } from '../config.js'

export const pool = createPool({
    host: HOST,
    user: USER_DATABASE,
    password: PASSWORD,
    port: PORT_DATABASE,
    database: NAME_DATABASE
})


//pool.getConnection((err, connection) => {
//    if (err) {
//      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//        console.log('DATABASE CONNECTION CLOSED')
//      }
//      if (err.code === 'ER_CON_COUNT_ERROR') {
//        console.log('DATABASE HAS TO MANY CONNECTIONS')
//      }
//      if (err.code === 'ECONNREFUSED') {
//        console.log('DATABASE CONNECTION WAS REFUSED')
//      }
//    }
//  
//    if (connection) {
//      connection.release()
//      console.log('DB is Connected')
//    }
//    return
//  })
//  
//pool.query = promisify(pool.query)