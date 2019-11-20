import { Service } from 'typedi'
import { getRepository, Repository, getConnection } from 'typeorm'
import { Trigger } from '../model/TriggerEntity'
import { ReadStream } from 'typeorm/platform/PlatformTools'

@Service()
export class TriggerService {
    private readonly triggerRepo: Repository<Trigger> = getRepository(Trigger)

    public async createTrigger(eventName: string, flowId: string): Promise<Trigger> {
        const trigger = new Trigger()

        trigger.eventName = eventName
        trigger.flowId = flowId
    
        return await this.triggerRepo.save(trigger)
    }

    public async getStreamByEvent(eventName: string): Promise<ReadStream> {
        return await this.triggerRepo
            .createQueryBuilder('trigger')
            .stream()
    }
}
