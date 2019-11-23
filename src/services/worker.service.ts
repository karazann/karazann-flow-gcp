import { Service, Inject } from 'typedi'
import { StorageService } from './storage.service'
import { logger } from '../utils/logger'
import { FlowEngine } from '../shared/flow'

@Service()
export class WorkerService {
    @Inject()
    private storage!: StorageService

    private engine: FlowEngine = new FlowEngine('name@1.0.0')

    async processFlow(flowId: string, triggerId: string): Promise<boolean | void> {
        logger.info(`Processing Flow: <${flowId}> form trigger: <${triggerId}>`)
    }
}
