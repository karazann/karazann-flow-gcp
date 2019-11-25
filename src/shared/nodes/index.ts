/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { FlowEngine } from '../flow'
import TestNode from './test-node'

export const registerNodes = (engine: FlowEngine) => {
    const nodes = [new TestNode()]

    // Register all nodes
    for (const node of nodes) {
        engine.register(node)
    }
}

// Export each node
export { TestNode }
