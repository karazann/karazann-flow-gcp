/*!
 * Copyright (c) 2019 Roland Sz.Kovács.
 */

import { Service } from 'typedi'
import { getRepository, Repository } from 'typeorm'
import { Trigger } from '../model/trigger.entity'
import { ReadStream } from 'typeorm/platform/PlatformTools'

@Service()
export class TriggerService {
    private readonly triggerRepo: Repository<Trigger> = getRepository(Trigger)

    getStreamByEvent(eventName: string): Promise<ReadStream> {
        const b = this.triggerRepo
            .createQueryBuilder('trigger')
            .select(['trigger.flowId', 'trigger.triggerNode'])
            .where('trigger.event_name = :eventName', { eventName })
        return b.stream()
    }
}
