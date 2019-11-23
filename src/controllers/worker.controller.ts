import { Post, Controller, Req, BadRequestError, HttpCode, OnUndefined } from 'routing-controllers'
import { WorkerService } from '../services/worker.service'
import { Inject } from 'typedi'
import { IPubSubAck, IPubSubMessage } from '../interfaces/pubsub.interface'

import { Request } from 'express'

@Controller('/work')
export class WorkerController {
    
    @Inject()
    private worker!: WorkerService

    /**
     * @api {post} /flow/process/:id Execute Flow Graph processing
     * @apiName Process Flow from Storage Bucket
     * @apiGroup Flow
     * @apiPermission Google Cloud service account
     *
     * @apiParam (Request body) {String} flow_id of the flow
     *
     * @apiSuccess (Success 201) {String} message Task saved successfully!
     */
    @Post('/')
    @HttpCode(200)
    @OnUndefined(409)
    async work(@Req() req: Request): Promise<IPubSubAck | undefined> {
        const message: IPubSubMessage = req.body.message

        if (!message) throw new BadRequestError('Not valid PubSub message!')
        if (!message.messageId) throw new BadRequestError('messageId field required!')
        if (!(message.attributes || message.data)) throw new BadRequestError('data or attributes field required!')

        // const result = this.worker.processFlow(message.data, '1')

        return Promise.resolve({ success: true })
    }
}
