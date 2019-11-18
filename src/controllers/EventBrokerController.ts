import { JsonController, Body, Post, OnUndefined, HttpCode } from 'routing-controllers'
import { logger } from '../logger'

interface IPubSubMessange {
    message: {
        attributes: {
            [key: string]: string
        }
        data: any
        messageId: string
    }
    subscription: string
}

interface IPubSubAck {
    success: boolean
}

@JsonController('/event')
export class EventBrokerController {
    constructor() {
        console.log('Hello')
    }

    /**
     * @api {post} /flow/process/:id Execute Flow Graph processing
     * @apiName Process Flow from Storage Bucket
     * @apiGroup Flow
     * @apiPermission Google Cloud service account
     *
     * @apiParam (Request body) {String} flow_id of the flow
     *
     * @apiExample {js} Example usage:
     * const data = {
     *   "flow_id": <uuid of the flow>
     * }
     *
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
