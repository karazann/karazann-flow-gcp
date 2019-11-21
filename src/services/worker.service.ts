import { FlowEngine } from '@szkabaroli/karazann-flow'
import { Service, Inject } from 'typedi'
import { StorageService } from './storage.service'
import { logger } from '../utils/logger'

@Service()
export class WorkerService {
    @Inject()
    private storage!: StorageService

    private engine: FlowEngine = new FlowEngine('name@1.0.0')

    public async processFlow(flowId: string, triggerId: string): Promise<boolean | void> {
        logger.info(`Processing Flow: <${flowId}> form trigger: <${triggerId}>`)
    }
}
