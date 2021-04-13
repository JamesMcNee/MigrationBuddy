import { ConfigProcessor } from "../src/config-processor";
import { Configuration } from "../src/model/configuration/configuration.model";

describe("Configuration Processor", () => {
  describe("validate", () => {
    it("should successfully validate a valid configuration", () => {
      // Given
      const validConfig = require("./resources/config-processor/validate/valid-config.json");

      // When
      const valid = new ConfigProcessor(validConfig).validate();

      // Then
      expect(valid).toBe(true);
    });

    it("should fail to validate an invalid configuration", () => {
      // Given
      const invalidConfig = {} as any;

      // When
      const valid = new ConfigProcessor(invalidConfig).validate();

      // Then
      expect(valid).toBe(false);
    });
  });

  describe("compile", () => {
    it("should compile - combining global substitutions with local ones", () => {
      // Given
      const input = require("./resources/config-processor/compile/input/combine-substitutions.json");

      // When
      const actual: Configuration | undefined = new ConfigProcessor(
        input
      ).compile().data;

      // Then
      const expected = require("./resources/config-processor/compile/output/combine-substitutions.json") as Configuration;

      expect(actual).toEqual(expected);
    });

    it("should compile - combining global headers with local ones", () => {
      // Given
      const input = require("./resources/config-processor/compile/input/combine-headers.json");

      // When
      const actual: Configuration | undefined = new ConfigProcessor(
        input
      ).compile().data;

      // Then
      const expected = require("./resources/config-processor/compile/output/combine-headers.json") as Configuration;

      expect(actual).toEqual(expected);
    });

    it("should compile - combining global options with local ones", () => {
      // Given
      const input = require("./resources/config-processor/compile/input/combine-options.json");

      // When
      const actual: Configuration | undefined = new ConfigProcessor(
        input
      ).compile().data;

      // Then
      const expected = require("./resources/config-processor/compile/output/combine-options.json") as Configuration;

      expect(actual).toEqual(expected);
    });
  });
});
