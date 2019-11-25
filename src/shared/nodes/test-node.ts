/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { NodeBuilder, Node } from '../flow'

export default class TestNode extends NodeBuilder {
    constructor() {
        super('')
        this.task = {
            outputs: {}
        }
    }

    build(node: Node) {
        console.debug('build')
    }

    worker() {
        console.debug('work')
    }
}
