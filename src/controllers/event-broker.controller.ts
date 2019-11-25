/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { Body, Post, HttpCode, Controller, BadRequestError, OnUndefined } from 'routing-controllers'
import { Inject } from 'typedi'

import { IPubSubMessage, IPubSubAck } from '../interfaces/pubsub.interface'
import { EventBrokerService } from '../services/event-broker.service'

interface IEventAttributes {
    eventName: string
    triggerId: string
}

@Controller('/event')
export class EventBrokerController {
    @Inject()
    private readonly brokerService!: EventBrokerService

    /**
     * @api {post} /event/user Create all flow jobs based on this event
     * @apiName Process Flow from Storage Bucket
     * @apiGroup EventBroker
     * @apiPermission Google Cloud service account
     *
     * @apiParam (Request body) {String} flow_id of the flow
     * @apiSuccess (Success 201) {String} message Task saved successfully!
     */
    @Post('/')
    @HttpCode(200)
    @OnUndefined(409)
    async userEvent(@Body() body: any): Promise<IPubSubAck | undefined> {
        // Validation
        const message: IPubSubMessage = body.message

        if (!message) throw new BadRequestError('Not valid PubSub message!')
        if (!message.messageId) throw new BadRequestError('messageId field required!')
        if (!message.attributes) throw new BadRequestError('attributes field required!')

        // Attribute validation
        const attr: IEventAttributes = message.attributes

        if (!attr.eventName) throw new BadRequestError('eventName missing in attributes!')

        try {
            // Process the event using event broker service
            await this.brokerService.processEvent(attr.eventName)

            // Ack the pub/sub message
            return { success: true }
        } catch (e) {
            console.debug(e)
            // On error return server error 500
            return undefined
        }
    }
}
