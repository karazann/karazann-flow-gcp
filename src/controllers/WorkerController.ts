import { JsonController, Body, Post, Controller } from 'routing-controllers'
import { WorkerService } from '../services/WorkerService'
import { Inject } from 'typedi'
import { logger } from '../logger'

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
     * @apiExample {js} Example usage:
     * const data = {
     *   "flow_id": <uuid of the flow>
     * }
     *
     * @apiSuccess (Success 201) {String} message Task saved successfully!
     */
    @Post('/work')
    public work(@Body() body: any): any {
        logger.info(JSON.stringify(body))
        const result = this.worker.processFlow('123', '1')
        return { test: 123 }
    }
}
