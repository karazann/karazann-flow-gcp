import { IFlowData } from './data'

export const isValidId = (id: string): boolean => {
    return /^[\w-]{3,}@[0-9]+\.[0-9]+\.[0-9]+$/.test(id)
}

export const isValidData = (data: IFlowData): boolean => {
    return typeof data.id === 'string' && isValidId(data.id) && data.nodes instanceof Object && !(data.nodes instanceof Array)
}

interface IValidateResult {
    success: boolean
    msg: string
}

export const validate = (id: string, data: IFlowData): IValidateResult => {
    const id1 = id.split('@')
    const id2 = data.id.split('@')
    const msg = []

    if (!isValidData(data)) msg.push('Data is not suitable')
    if (id !== data.id) msg.push('IDs not equal')
    if (id1[0] !== id2[0]) msg.push("Names don't match")
    if (id1[1] !== id2[1]) msg.push("Versions don't match")

    return {
        success: Boolean(!msg.length),
        msg: msg.join('. ')
    }
}
