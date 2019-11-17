import { JsonController, Body, Get, OnUndefined } from 'routing-controllers'

@JsonController()
export class FlowWorkerController {
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
    @Get('/work')
    private flowWorker(@Body() body: Object): Object {
        console.log(body)
        return { test: 123}
    }
}
