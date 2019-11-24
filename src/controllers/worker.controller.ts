import { Post, Controller, BadRequestError, HttpCode, OnUndefined, Body } from 'routing-controllers'
import { WorkerService } from '../services/worker.service'
import { Inject } from 'typedi'
import { IPubSubAck, IPubSubMessage } from '../interfaces/pubsub.interface'

interface IJobAttributes {
    flowId: string
    triggerNode: string
}

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
    async work(@Body() body: any): Promise<IPubSubAck | undefined> {
        // Validation
        const message: IPubSubMessage = body.message

        if (!message) throw new BadRequestError('Not valid PubSub message!')
        if (!message.messageId) throw new BadRequestError('messageId field required!')
        if (!(message.attributes || message.data)) throw new BadRequestError('data or attributes field required!')

        // Attribute validation
        const attr: IJobAttributes = message.attributes

        if (!attr.flowId) throw new BadRequestError('flowId missing in attributes!')
        if (!attr.triggerNode) throw new BadRequestError('triggerNode missing in attributes!')

        try {
            await this.worker.processFlow(attr.flowId, attr.triggerNode)
            return { success: true }
        } catch (e) {
            return undefined
        }
    }
}
