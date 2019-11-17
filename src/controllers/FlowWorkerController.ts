import { JsonController, Body, Post, OnUndefined } from 'routing-controllers'

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
    @Post('/work')
    private trigger(@Body() body: Object): unknown {
        console.log(body)
        return undefined
        //return { msg: 'add_called' }
    }
}
