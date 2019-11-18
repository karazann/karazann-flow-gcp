import { Body, Post, OnUndefined, HttpCode, Controller } from 'routing-controllers'
import { logger } from '../logger'
import { IPubSubMessange, IPubSubAck } from '../interfaces/PubSub'

@Controller('/event')
export class EventBrokerController {
    constructor() {
        console.log('Hello')
    }

    /**
     * @api {post} /flow/process/:id Execute Flow Graph processing
     * @apiName Process Flow from Storage Bucket
     * @apiGroup EventBroker
     * @apiPermission Google Cloud service account
     *
     * @apiParam (Request body) {String} flow_id of the flow
     * @apiSuccess (Success 201) {String} message Task saved successfully!
     */
    @Post('/user')
    @HttpCode(201) // Created
    @OnUndefined(422) // Unprocessable Entity
    public userEvent(@Body() body: IPubSubMessange): IPubSubAck {
        console.log(body)
        return { success: true }
    }

    @Post('/time')
    @HttpCode(201) // Created
    public timeEvent(@Body() body: IPubSubMessange): IPubSubAck {
        logger.info({message: JSON.stringify(body), module: 'mb-controller'})
        return { success: true }
    }
}
