import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'
import { TogetherLLM } from 'llamaindex'

class ChatTogetherAI_LlamaIndex_LLMs implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    tags: string[]
    credential: INodeParams
    inputs: INodeParams[]

    constructor() {
        this.label = 'ChatTogetherAI'
        this.name = 'chatTogetherAI_LlamaIndex'
        this.version = 1.0
        this.type = 'ChatTogetherAI'
        this.icon = 'togetherai.png'
        this.category = 'Chat Models'
        this.description = 'Wrapper around TogetherAI large language models that use the Chat endpoint specific for LlamaIndex'
        this.baseClasses = [this.type, 'BaseChatModel_LlamaIndex', ...getBaseClasses(TogetherLLM)]
        this.tags = ['LlamaIndex']
        this.credential = {
            label: 'Connect Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['togetherAIApi']
        }
        this.inputs = [
            {
                label: 'Model Name',
                name: 'modelName',
                type: 'options',
                options: [
                    {
                        label: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
                        name: 'mistralai/Mixtral-8x7B-Instruct-v0.1'
                    },
                    {
                        label: 'mistralai/Mistral-7B-Instruct-v0.1',
                        name: 'mistralai/Mistral-7B-Instruct-v0.1'
                    },
                    {
                        label: 'mistralai/Mistral-7B-Instruct-v0.2',
                        name: 'mistralai/Mistral-7B-Instruct-v0.2'
                    },
                    {
                        label: 'NousResearch/Nous-Hermes-2-Mistral-7B-DPO',
                        name: 'NousResearch/Nous-Hermes-2-Mistral-7B-DPO'
                    },
                    {
                        label: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO',
                        name: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO'
                    },
                    {
                        label: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-SFT',
                        name: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-SFT'
                    },
                    {
                        label: 'teknium/OpenHermes-2p5-Mistral-7B',
                        name: 'teknium/OpenHermes-2p5-Mistral-7B'
                    }
                ],
                default: 'NousResearch/Nous-Hermes-2-Mistral-7B-DPO',
                optional: true
            },
            {
                label: 'Temperature',
                name: 'temperature',
                type: 'number',
                step: 0.1,
                default: 0.9,
                optional: true
            },
            {
                label: 'Max Tokens',
                name: 'maxTokens',
                type: 'number',
                step: 1,
                optional: true,
                additionalParams: true
            },
            {
                label: 'Top Probability',
                name: 'topP',
                type: 'number',
                step: 0.1,
                optional: true,
                additionalParams: true
            },
            {
                label: 'Timeout',
                name: 'timeout',
                type: 'number',
                step: 1,
                optional: true,
                additionalParams: true
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const temperature = nodeData.inputs?.temperature as string
        const modelName = nodeData.inputs?.modelName as string
        const maxTokens = nodeData.inputs?.maxTokens as string
        const topP = nodeData.inputs?.topP as string
        const timeout = nodeData.inputs?.timeout as string

        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const togetherAIApiKey = getCredentialParam('togetherAIApiKey', credentialData, nodeData)

        const obj: Partial<TogetherLLM> = {
            temperature: parseFloat(temperature),
            model: modelName,
            apiKey: togetherAIApiKey
        }

        if (maxTokens) obj.maxTokens = parseInt(maxTokens, 10)
        if (topP) obj.topP = parseFloat(topP)
        if (timeout) obj.timeout = parseInt(timeout, 10)

        const model = new TogetherLLM(obj)
        return model
    }
}

module.exports = { nodeClass: ChatTogetherAI_LlamaIndex_LLMs }
