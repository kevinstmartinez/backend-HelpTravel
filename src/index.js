import app from './app.js'
import {PORT_SERVIDORS} from './config.js'

app.listen(PORT_SERVIDORS) // que escuche el servidor en el puerto
console.log('Server on port', PORT_SERVIDORS)