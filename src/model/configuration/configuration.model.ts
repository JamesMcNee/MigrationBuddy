
export interface Configuration {
    endpoints: { [key: string]: EndpointConfiguration },
    substitutions: { [key: string]: string | number },
    configuration: {
        control: ServiceConfiguration,
        candidate: ServiceConfiguration
    }
}

export interface ServiceConfiguration {
    url: string,
    headers?: { [key: string]: string }
}

export interface EndpointConfiguration {
    candidatePath?: string,
    substitutions: { [key: string]: string | number },
    options: EndpointConfigurationOptions
}

export interface EndpointConfigurationOptions {
    diff: {
        sortArrays: boolean,
        ignoreKeys: string[]
    }
}