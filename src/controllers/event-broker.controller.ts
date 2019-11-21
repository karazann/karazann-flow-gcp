import { Body, Post, HttpCode, Controller, BadRequestError } from 'routing-controllers'
import { Inject } from 'typedi'

import { IPubSubMessage, IPubSubAck } from '../interfaces/pubsub.interface'
import { TriggerService } from '../shared/trigger'
import { logger } from '../utils/logger'

@Controller('/event')
export class EventBrokerController {
    
    @Inject()
    public triggerService!: TriggerService

    /**
     * @api {post} /event/user Create all flow jobs based on this event
     * @apiName Process Flow from Storage Bucket
     * @apiGroup EventBroker
     * @apiPermission Google Cloud service account
     *
     * @apiParam (Request body) {String} flow_id of the flow
     * @apiSuccess (Success 201) {String} message Task saved successfully!
     */
    @Post('/user')
    @HttpCode(200)
    public async userEvent(@Body() body: any): Promise<any> {
        this.testMem()

        /** Validation */
        const message: IPubSubMessage = body.message

        if (!message) throw new BadRequestError('Not valid PubSub message!')
        if (!message.messageId) throw new BadRequestError('messageId field required!')
        if (!(message.attributes || message.data)) throw new BadRequestError('data or attributes field required!')

        /** Streaming triggers using this event */
        const stream = await this.triggerService.getStreamByEvent('event_name')

        stream.on('data', async data => {
            const d = Object.keys(data).reduce((destination: any, key) => {
                const newKey = key.split(/_(.+)/)[1]
                destination[newKey] = data[key]
                return destination
            }, {})

            // console.log('received:', data)
            // console.log('transformed: ', d)
            this.testMem()
        })

        /** When stream ended log something */
        stream.on('end', () => {
            console.log('end')
        })

        return { success: true }
        /** Ack the pub/sub message */
    }

    @Post('/time')
    @HttpCode(201) // Created
    public async timeEvent(@Body() body: IPubSubMessage): Promise<IPubSubAck> {
        logger.info({ message: JSON.stringify(body), module: 'mb-controller' })
        return { success: true }
    }

    private testMem() {
        const used = process.memoryUsage().heapTotal
        console.info(`heap: ${Math.round((used / 1024 / 1024) * 100) / 100} MB`)
    }
}
