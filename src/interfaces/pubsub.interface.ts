export interface IPubSubBody {
    message: IPubSubMessage
    subscriptionId: string
}

export interface IPubSubMessage {
    attributes?: any
    data?: any
    messageId: string
}

export interface IPubSubAck {
    success: boolean
}
