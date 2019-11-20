import { Node } from './node'
import { Pin } from './pin'
import { InputData, OutputData } from './core/data'

export class Connection {
    constructor(public output: Output, public input: Input, public data: unknown = {}) {
        this.input.addConnection(this)
    }

    public remove(): void {
        this.input.removeConnection(this)
        this.output.removeConnection(this)
    }
}

export class IO {
    public node: Node | null = null
    public multipleConnections: boolean
    protected connections: Connection[] = []

    constructor(public key: string, public name: string, public pin: Pin, multiConns: boolean) {
        this.node = null
        this.multipleConnections = multiConns
        this.connections = []
    }

    public hasConnection(): boolean {
        return this.connections.length > 0
    }

    public removeConnection(connection: Connection): void {
        this.connections.splice(this.connections.indexOf(connection), 1)
    }

    public removeConnections(): void {
        this.connections.forEach(connection => this.removeConnection(connection))
    }
}

export class Input extends IO {
    constructor(key: string, title: string, pin: Pin, multiConns: boolean = false) {
        super(key, title, pin, multiConns)
    }

    public addConnection(connection: Connection): void {
        if (!this.multipleConnections && this.hasConnection()) throw new Error('Multiple connections not allowed')
        this.connections.push(connection)
    }

    public toJSON(): InputData {
        return {
            connections: this.connections.map(c => {
                if (!c.output.node) throw new Error('Node not added to Output')

                return {
                    node: c.output.node.id,
                    output: c.output.key,
                    data: c.data
                }
            })
        }
    }
}

export class Output extends IO {
    constructor(key: string, title: string, pin: Pin, multiConns: boolean = true) {
        super(key, title, pin, multiConns)
    }

    public connectTo(input: Input): Connection {
        if (!this.pin.compatibleWith(input.pin)) throw new Error('Sockets not compatible')
        if (!input.multipleConnections && input.hasConnection()) throw new Error('Input already has one connection')
        if (!this.multipleConnections && this.hasConnection()) throw new Error('Output already has one connection')

        const connection = new Connection(this, input)

        this.connections.push(connection)
        return connection
    }

    public connectedTo(input: Input): boolean {
        return this.connections.some(item => {
            return item.input === input
        })
    }

    public toJSON(): OutputData {
        return {
            connections: this.connections.map(c => {
                if (!c.input.node) throw new Error('Node not added to Input')

                return {
                    node: c.input.node.id,
                    input: c.input.key,
                    data: c.data
                }
            })
        }
    }
}
