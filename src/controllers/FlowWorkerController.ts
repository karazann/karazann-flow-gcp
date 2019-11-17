import { JsonController, Body, Post } from 'routing-controllers'
import { WorkerService } from '../services/WorkerService'

@JsonController()
export class FlowWorkerController {
    constructor(worker: WorkerService) {}

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
    public flowWorker(@Body() body: Object): Object {
        console.log(body)
        return { test: 123 }
    }
}
