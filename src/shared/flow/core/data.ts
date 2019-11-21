export interface IConnectionData {
    node: number
    data: unknown
}

export type InputConnectionData = IConnectionData & {
    output: string
}
export type OutputConnectionData = IConnectionData & {
    input: string
}

export interface IInputData {
    connections: InputConnectionData[]
}
export interface IOutputData {
    connections: OutputConnectionData[]
}

export interface IInputsData {
    [key: string]: IInputData
}
export interface IOutputsData {
    [key: string]: IOutputData
}

export interface INodeData {
    id: number
    name: string
    inputs: IInputsData
    outputs: IOutputsData
    data: { [key: string]: unknown }
    position: [number, number]
}

export interface INodesData {
    [id: string]: INodeData
}

export interface IFlowData {
    id: string
    nodes: INodesData
}

export interface IWorkerInputs {
    [key: string]: unknown[]
}

export interface IWorkerOutputs {
    [key: string]: unknown
}
