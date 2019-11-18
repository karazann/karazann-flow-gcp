export interface IPubSubMessange {
    attributes: any
    data: any
    messageId: string
}

export interface IPubSubAck {
    success: boolean
}
