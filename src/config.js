// para que lea el .env y utilizar las variables de entorno
import {config} from 'dotenv'

export default{
    SECRET_TOKENT: 'HelpTravel-api'
}

config()

export const PORT_SERVIDORS = process.env.PORT_SERVIDORS || 3001

export const HOST = process.env.HOST || 'localhost'
export const USER_DATABASE = process.env.USER_DATABASE || 'root'
export const PASSWORD = process.env.PASSWORD || 'Punisher'
export const PORT_DATABASE = process.env.PORT_DATABASE || 3306
export const NAME_DATABASE = process.env.NAME_DATABASE || 'helpTravel_02'

export const SESSION_TRACKER = process.env.SESSION_TRACKER
export const APIKEY = process.env.APIKEY