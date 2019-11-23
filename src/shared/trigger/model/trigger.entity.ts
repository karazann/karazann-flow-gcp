import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

export interface ITrigger {
    triggerId: string
    flowId: string
    eventName: string,
    triggerNode: string
}

@Entity('triggers')
export class Trigger extends BaseEntity implements ITrigger {
    // The unique id of this trigger
    @PrimaryGeneratedColumn('uuid', { name: 'trigger_id' })
    triggerId!: string

    // The Id of the flow containing this trigger
    @Column({ type: 'text', name: 'flow_id', nullable: false })
    flowId!: string

    // This is the node that represent this trigger in the flow
    @Column({ type: 'text', name: 'triggerNode', nullable: false })
    triggerNode!: string
    
    // This is the event when this trigger is getting invoked
    @Column({ type: 'text', name: 'event_name', nullable: false })
    eventName!: string
}
