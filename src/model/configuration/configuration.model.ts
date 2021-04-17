export interface Configuration {
  endpoints: { [key: string]: EndpointConfiguration };
  configuration: {
    global: GlobalConfiguration;
    control: ServiceConfiguration;
    candidate: ServiceConfiguration;
  };
}

export interface GlobalConfiguration {
  substitutions: { [key: string]: string | number };
  headers?: { [key: string]: string };
  options: GlobalConfigurationOptions;
}

export interface ServiceConfiguration {
  url: string;
  headers?: { [key: string]: string };
}

export interface EndpointConfiguration {
  candidatePath?: string;
  substitutions: { [key: string]: string | number };
  headers?: { [key: string]: string };
  options: EndpointConfigurationOptions;
}

export interface EndpointConfigurationOptions {
  diff: {
    sortArrays: boolean;
    ignoreKeys: string[];
  };
}

export interface GlobalConfigurationOptions extends EndpointConfigurationOptions {
  htmlReport: {
    theme: "light" | "dark";
  };
}
