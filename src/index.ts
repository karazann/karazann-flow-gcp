
import * as bodyParser from 'body-parser'
import { Server } from '@overnightjs/core'
import EventTriggerController from './EventTriggerController'

class FlowServer extends Server {
 
    constructor() {
        super(false)
        
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({extended: true}))
        
        super.addControllers([new EventTriggerController()])
    }
 
 
    public start(port: number) {
        this.app.listen(port, () => {
            console.log('Server listening on port: ' + port)
        })
    }
}

const server = new FlowServer()
const PORT = parseInt(process.env.PORT as string, 10) || 8080 
server.start(PORT)