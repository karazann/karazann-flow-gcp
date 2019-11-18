import { Service } from 'typedi'
import { getRepository, Repository } from 'typeorm'
import { Trigger } from '../models/trigger'

@Service()
export class TriggerService {
    private userRepo: Repository<Trigger> = getRepository(Trigger)

    public async getTriggersFromEvent(): Promise<Trigger> {
        const trigger = new Trigger()
        return await this.userRepo.save(trigger)
    }
}