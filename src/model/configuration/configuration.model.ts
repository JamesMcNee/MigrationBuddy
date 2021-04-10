
export interface Configuration {
    endpoints: { [key: string]: EndpointConfiguration },
    configuration: {
        control: ServiceConfiguration,
        candidate: ServiceConfiguration
    }
}

export interface EndpointConfiguration {
    candidatePath?: string,
    substitutions: { [key: string]: string | number }
}

export interface ServiceConfiguration {
    url: string,
    headers?: { [key: string]: string }
}