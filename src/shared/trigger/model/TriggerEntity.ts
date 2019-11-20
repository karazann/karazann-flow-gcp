import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('triggers')
export class Trigger {
    /** The unique id of this trigger */
    @PrimaryGeneratedColumn('uuid', { name: '_trigger_id' })
    public triggerId!: string

    /** The Id of the flow containing this trigger */
    @Column({ type: 'text', name: 'flow_id', nullable: false })
    public flowId!: string

    /** This is the event when this trigger is getting invoked */
    @Column({ type: 'text', name: 'event_name', nullable: false })
    public eventName!: string
}
