import { Service, Inject } from 'typedi'
import { FATAL } from 'bunyan';

@Service()
export class EventService {
    public async processEvent(eventName: string, triggerId: string): Promise<boolean | void> {
        /*const entry = {
            severity: 'INFO',
            message: `Processing Flow: <${flowId}> form trigger: <${triggerId}>`
        }
        console.info(entry)*/
    }
}