import { JSONSchemaType } from "ajv";
import {
  Configuration,
  EndpointConfiguration,
  EndpointConfigurationOptions,
  GlobalConfiguration,
  GlobalConfigurationOptions,
  ServiceConfiguration,
} from "./configuration.model";

export class ConfigurationSchema {
  private static _substitutionsSchema: JSONSchemaType<{
    [key: string]: string | number;
  }> = {
    type: "object",
    required: [],
    nullable: true,
    patternProperties: {
      ".{1,}": {
        oneOf: [
          { type: "string", nullable: false },
          { type: "number", nullable: false },
        ],
      },
    },
  };

  private static _endpointOptionsSchema: JSONSchemaType<EndpointConfigurationOptions> = {
    type: "object",
    required: [],
    nullable: true,
    properties: {
      diff: {
        type: "object",
        required: [],
        nullable: true,
        properties: {
          sortArrays: {
            type: "boolean",
            nullable: true,
          },
          ignoreKeys: {
            type: "array",
            nullable: true,
            items: {
              type: "string",
            },
          },
        },
      },
    },
  };

  private static _globalConfigurationOptionsSchema: JSONSchemaType<GlobalConfigurationOptions> = {
    type: "object",
    required: [],
    properties: {
      ...ConfigurationSchema._endpointOptionsSchema.properties,
      htmlReport: {
        type: "object",
        required: [],
        nullable: true,
        properties: {
          theme: {
            type: "string",
            nullable: true,
            enum: ["light", "dark"],
          },
        },
      },
    },
  };

  private static _endpointSchema: JSONSchemaType<EndpointConfiguration> = {
    type: "object",
    required: [],
    properties: {
      candidatePath: {
        type: "string",
        nullable: true,
      },
      substitutions: {
        ...ConfigurationSchema._substitutionsSchema,
        nullable: true,
      },
      headers: {
        type: "object",
        required: [],
        nullable: true,
        patternProperties: {
          ".{1,}": { type: "string", nullable: false },
        },
      },
      options: {
        ...ConfigurationSchema._endpointOptionsSchema,
        nullable: true,
      },
    },
  };

  private static _serviceConfigurationSchema: JSONSchemaType<ServiceConfiguration> = {
    type: "object",
    required: ["url"],
    properties: {
      url: { type: "string", nullable: false },
      headers: {
        type: "object",
        required: [],
        nullable: true,
        patternProperties: {
          ".{1,}": { type: "string", nullable: false },
        },
      },
    },
  };

  private static _globalConfigurationSchema: JSONSchemaType<GlobalConfiguration> = {
    type: "object",
    required: [],
    properties: {
      substitutions: {
        ...ConfigurationSchema._substitutionsSchema,
        nullable: true,
      },
      headers: {
        type: "object",
        required: [],
        nullable: true,
        patternProperties: {
          ".{1,}": { type: "string", nullable: false },
        },
      },
      options: {
        ...ConfigurationSchema._globalConfigurationOptionsSchema,
        nullable: true,
      },
    },
  };

  private static _schema: JSONSchemaType<Configuration> = {
    type: "object",
    required: ["endpoints", "configuration"],
    properties: {
      endpoints: {
        type: "object",
        minProperties: 1,
        required: [],
        patternProperties: {
          ".{1,}": ConfigurationSchema._endpointSchema,
        },
      },
      configuration: {
        type: "object",
        required: ["control", "candidate"],
        properties: {
          global: {
            ...ConfigurationSchema._globalConfigurationSchema,
            nullable: true,
          },
          control: ConfigurationSchema._serviceConfigurationSchema,
          candidate: ConfigurationSchema._serviceConfigurationSchema,
        },
      },
    },
  };

  static get schema(): JSONSchemaType<Configuration> {
    return this._schema;
  }
}
