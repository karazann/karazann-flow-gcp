import { Context } from '../core/context'
import { Node } from '../node'
import { Connection, Input, Output } from '../io'

export class Editor extends Context {
    nodes: Node[] = []

    constructor(container: HTMLElement) {
        super()
    }

    addNode(node: Node) {
        this.nodes.push(node)
        // this.view.addNode(node)

        this.emit('nodecreated', node)
    }

    removeNode(node: Node) {
        node.getConnections().forEach(c => this.removeConnection(c))

        this.nodes.splice(this.nodes.indexOf(node), 1)
        // this.view.removeNode(node)

        this.emit('noderemoved', node)
    }

    connect(output: Output, input: Input) {
        // if (!this.emit('connectioncreate', input, output)) return

        try {
            const connection = output.connectTo(input)
            // this.view.addConnection(connection);

            this.emit('connectioncreated', connection)
        } catch (e) {
            console.warn(e)
            // this.emit('warn', e)
        }
    }

    removeConnection(connection: Connection) {
        // if (!this.emit('connectionremove', connection)) return

        // this.view.removeConnection(connection);
        connection.remove()

        this.emit('connectionremoved', connection)
    }

    getBuilder(name: string) {
        const builder = this.builders.get(name)

        if (!builder) throw new Error(`Builder ${name} not found`)
        
        return builder
    }

    clear() {
        [...this.nodes].forEach(node => this.removeNode(node))
        this.emit('clear')
    }
}
