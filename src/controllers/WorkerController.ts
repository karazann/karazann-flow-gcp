import { JsonController, Body, Post, Controller, Req, BadRequestError } from 'routing-controllers'
import { WorkerService } from '../services/WorkerService'
import { Inject } from 'typedi'
import { logger } from '../logger'
import { IPubSubMessange, IPubSubAck } from '../interfaces/PubSub'

import { Request } from 'express'

@Controller()
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
    @Post('/work')
    private work(@Req() req: Request): IPubSubAck {
        const message: IPubSubMessange = req.body.message

        if (!message) throw new BadRequestError('Not valid PubSub message!')
        if ((!message.messageId)) throw new BadRequestError('messageId field required!')
        if (!(message.attributes || message.data)) throw new BadRequestError('data or attributes field required!')

        const result = this.worker.processFlow(message.data, '1')

        return { success: true }
    }
}
