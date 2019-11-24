import { PubSub, Topic } from '@google-cloud/pubsub'
import { Service, Inject } from 'typedi'
import { TriggerService, ITrigger } from '../shared/trigger'

const printMemory = () => {
    const used = process.memoryUsage().heapTotal
    console.debug(`heap: ${Math.round((used / 1024 / 1024) * 100) / 100} MB`)
}

const toCamel = (s: string) => {
    return s.replace(/([-_][a-z])/gi, ($1: string) => {
        return $1
            .toUpperCase()
            .replace('-', '')
            .replace('_', '')
    })
}

interface IJobDescription {
    flowId: string
    triggerNode: string
}

@Service()
export class EventBrokerService {
    @Inject()
    private readonly triggerService!: TriggerService

    private readonly pubsub = new PubSub()
    private readonly batchPublisher: Topic

    constructor() {
        const topicName = process.env.TOPIC_JOBS as string
        const maxMessages = 10
        const maxMilliseconds = 10000

        // Setup the job topic with publish batching
        this.batchPublisher = this.pubsub.topic(topicName, {
            batching: {
                maxMessages,
                maxMilliseconds
            }
        })
    }

    /**
     * This method process all the trigger which has the same eventName
     * @param eventName The name of the event we are fireing
     */
    async processEvent(eventName: string): Promise<void> {
        printMemory()

        // Streaming triggers using this event
        const stream = await this.triggerService.getStreamByEvent(eventName)

        // Return promise which resolve when processing done
        return new Promise((resolve, reject) => {
            stream.on('data', async data => {
                printMemory()

                const { flowId, triggerNode } = Object.keys(data).reduce((destination: any, key) => {
                    const newKey = key.split(/_(.+)/)[1]
                    destination[toCamel(newKey)] = data[key]
                    return destination
                }, {}) as ITrigger

                try {
                    // Send a PubSub message to the worker queue
                    await this.sendWorkerJob(flowId, triggerNode)
                } catch (e) {
                    // If error happen reject the processing
                    reject(e)
                }
            })

            // When stream ended resolve the promise
            stream.on('end', () => resolve())
        })
    }

    /**
     * Send a PubSub message to the worker queue with the trigger inforamations
     * @param flowId This is the flow which contain the trigger
     * @param triggerNode The node in the flow we are going to trigger
     */
    private async sendWorkerJob(flowId: string, triggerNode: string): Promise<void> {
        // Description of the job
        const rawData: IJobDescription = {
            flowId,
            triggerNode
        }

        const buffer = Buffer.from(JSON.stringify(rawData))

        // Send the job to the queue with batching
        try {
            await this.batchPublisher.publish(buffer)
        } catch (e) {
            console.debug(e)
        }
    }
}
