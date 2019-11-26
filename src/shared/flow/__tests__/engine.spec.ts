/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { FlowEngine } from '../engine'
import { Builder1, Builder2 } from './data'

describe.skip('Engine', () => {
    const id = 'test@0.0.1'
    const data = { id, nodes: {} }

    const createValidEngine = () => {
        const eng = new FlowEngine(id)
        eng.register(new Builder1())
        eng.register(new Builder2())
        return eng
    }

    /*it('should init without error', async () => {
        assert.doesNotThrow(createValidEngine, Error, 'valid')
        assert.throws(() => new FlowEngine('test@0.1'), Error, 'wrong id')
    })*/

    describe('instance', () => {
        let engine: FlowEngine

        beforeEach(() => {
            engine = createValidEngine()
        })

        /*it('should accept only valid flow data', async () => {
            assert.equal(await engine.process(data), 'success')
            assert.notEqual(await engine.process({ id: 'test@1.0.0', nodes: {} }), 'success', 'wrong id')
        })*/

        /*it('validation', async () => {
            assert.notEqual(await engine.process(recursiveData as any), 'success', 'recursive data')
        })*/

        /*it('clone', () => {
            const engineClone = engine.clone()

            assert.equal(engineClone instanceof Engine, true, 'is instance')
            assert.equal(engineClone.id, engine.id, 'id')
            assert.deepEqual(engineClone.components, engine.components, 'components')
        })*/

        it('should exit properly when call engine.exit()', async done => {
            engine
                .process(data as any)
                .then(v => {
                    assert.equal(v, 'aborted', 'Check aborted process')
                })
                .catch(done)
            engine.exit()

            const v = await engine.process(data as any)
            assert.equal(Boolean(v), false, 'Not aborted completely')
            done()
        })

        /*describe('process without abort', () => {
            let cw = console.warn
            before(() => (console.warn = () => {}))
            after(() => (console.warn = cw))

            it('process warn', done => {
                engine.process(data)
                engine
                    .process(data)
                    .then(r => {
                        assert.equal(Boolean(r), false, 'cannot process simultaneously')
                    })
                    .then(done)
                    .catch(done)
            })
        })*/

        /*it('process start node', async () => {
            const correctId = Object.keys(addNumbersData.nodes)[0]
            const wrongId = Number.POSITIVE_INFINITY

            assert.equal(await engine.process(addNumbersData as any, correctId), 'success')
            // assert.equal(await engine.process(addNumbersData as any, wrongId), 'error')
        })*/
    })
})
