import { Storage } from '@google-cloud/storage'
import { FlowEngine } from '@szkabaroli/karazann-flow'
import { Service } from 'typedi'

@Service()
export class WorkerService {
    private engine: FlowEngine = new FlowEngine('test@1.0.0')

    public async processFlow(flowId: string, triggerId: string): Promise<boolean | void> {
        const entry = {
            severity: 'INFO',
            message: `Processing Flow: <${flowId}> form trigger: <${triggerId}>`
        }
        console.info(entry)
    }
}