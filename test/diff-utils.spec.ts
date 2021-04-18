import { DiffUtils } from "../src/diff-utils";

const cloneDeep = require("lodash.clonedeep");

describe("Diff Utils", () => {
  describe("format", () => {
    beforeEach(() => {
      spyOn(DiffUtils, "removeKeysRecursively");
      spyOn(DiffUtils, "sortArraysRecursively");
    });

    it("should call removeKeysRecursively if option present in config", () => {
      // Given
      const input = {
        id: 1234,
        hobbies: ["Fishing", "Basketball", "Swimming"],
      };

      // When
      DiffUtils.format(input, { diff: { ignoreKeys: ["test"] } });

      // Then
      expect(DiffUtils.removeKeysRecursively).toHaveBeenCalledWith(input, ["test"]);
    });

    it("should not call removeKeysRecursively if option not present in config", () => {
      // Given
      const input = {
        id: 1234,
        hobbies: ["Fishing", "Basketball", "Swimming"],
      };

      // When
      DiffUtils.format(input, {});

      // Then
      expect(DiffUtils.removeKeysRecursively).toHaveBeenCalledTimes(0);
    });

    it("should call sortArraysRecursively if option present and true in config", () => {
      // Given
      const input = {
        id: 1234,
        hobbies: ["Fishing", "Basketball", "Swimming"],
      };

      // When
      DiffUtils.format(input, { diff: { sortArrays: true } });

      // Then
      expect(DiffUtils.sortArraysRecursively).toHaveBeenCalledWith(input, undefined);
    });

    it("should not call sortArraysRecursively if option present in config as false", () => {
      // Given
      const input = {
        id: 1234,
        hobbies: ["Fishing", "Basketball", "Swimming"],
      };

      // When
      DiffUtils.format(input, { diff: { sortArrays: false } });

      // Then
      expect(DiffUtils.sortArraysRecursively).toHaveBeenCalledTimes(0);
    });

    it("should not call sortArraysRecursively if option not present in config", () => {
      // Given
      const input = {
        id: 1234,
        hobbies: ["Fishing", "Basketball", "Swimming"],
      };

      DiffUtils.sortArraysRecursively = jest.fn();

      // When
      DiffUtils.format(input, {});

      // Then
      expect(DiffUtils.sortArraysRecursively).toHaveBeenCalledTimes(0);
    });
  });

  describe("sortArraysRecursively", () => {
    it("should handle null/undefined values", () => {
      // Given
      const input = null;

      // When
      const actual = DiffUtils.sortArraysRecursively(input);

      // Then
      expect(actual).toBeNull();
    });

    it("should not mutate the original input object", () => {
      // Given
      const input = {
        id: 1234,
        hobbies: ["Fishing", "Basketball", "Swimming"],
      };

      const clonedInput = cloneDeep(input);

      // When
      DiffUtils.sortArraysRecursively(input);

      // Then
      expect(input).toEqual(clonedInput);
    });

    it("should sort a string array alphabetically", () => {
      // Given
      const input = {
        id: 1234,
        hobbies: ["Fishing", "Basketball", "Swimming"],
      };

      // When
      const actual = DiffUtils.sortArraysRecursively(input);

      // Then
      const expected = {
        id: 1234,
        hobbies: ["Basketball", "Fishing", "Swimming"],
      };

      expect(actual).toEqual(expected);
    });

    it("should sort a numerical array ascending", () => {
      // Given
      const input = {
        id: 1234,
        favouriteNumbers: [2, 1, 3],
      };

      // When
      const actual = DiffUtils.sortArraysRecursively(input);

      // Then
      const expected = {
        id: 1234,
        favouriteNumbers: [1, 2, 3],
      };

      expect(actual).toEqual(expected);
    });

    it("should sort a object array -- using stringification sort", () => {
      // Given
      const input = {
        id: 1234,
        contacts: [
          {
            id: 3456,
            forename: "Jack",
          },
          {
            id: 2345,
            forename: "John",
          },
        ],
      };

      // When
      const actual = DiffUtils.sortArraysRecursively(input);

      // Then
      const expected = {
        id: 1234,
        contacts: [
          {
            id: 2345,
            forename: "John",
          },
          {
            id: 3456,
            forename: "Jack",
          },
        ],
      };

      expect(actual).toEqual(expected);
    });

    it("should sort a object array -- using supplied sort by keys -- one key provided", () => {
      // Given
      const input = {
        id: 1234,
        contacts: [
          {
            id: 3456,
            forename: "Alice",
          },
          {
            id: 2345,
            forename: "Zach",
          },
          {
            id: 2345,
            forename: "Fred",
          },
        ],
      };

      // When
      const actual = DiffUtils.sortArraysRecursively(input, ["forename"]);

      // Then
      const expected = {
        id: 1234,
        contacts: [
          {
            id: 3456,
            forename: "Alice",
          },
          {
            id: 2345,
            forename: "Fred",
          },
          {
            id: 2345,
            forename: "Zach",
          },
        ],
      };

      expect(actual).toEqual(expected);
    });

    it("should sort a object array -- using first available sort by key -- two keys provided", () => {
      // Given
      const input = {
        id: 1234,
        contacts: [
          {
            id: 3456,
            forename: "Alice",
          },
          {
            id: 2345,
            forename: "Zach",
          },
          {
            id: 2345,
            forename: "Fred",
          },
        ],
      };

      // When
      const actual = DiffUtils.sortArraysRecursively(input, ["missing", "forename"]);

      // Then
      const expected = {
        id: 1234,
        contacts: [
          {
            id: 3456,
            forename: "Alice",
          },
          {
            id: 2345,
            forename: "Fred",
          },
          {
            id: 2345,
            forename: "Zach",
          },
        ],
      };

      expect(actual).toEqual(expected);
    });

    it("should sort a nested array", () => {
      // Given
      const input = {
        id: 1234,
        skills: {
          languages: ["English", "Dutch", "Latin"],
        },
      };

      // When
      const actual = DiffUtils.sortArraysRecursively(input);

      // Then
      const expected = {
        id: 1234,
        skills: {
          languages: ["Dutch", "English", "Latin"],
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("removeKeysRecursively", () => {
    it("should handle null/undefined values", () => {
      // Given
      const input = null;

      // When
      const actual = DiffUtils.removeKeysRecursively(input, ["id"]);

      // Then
      expect(actual).toBeNull();
    });

    it("should not mutate the original input object", () => {
      // Given
      const input = {
        id: 1234,
        forename: "John",
        surname: "Smith",
      };

      const clonedInput = cloneDeep(input);

      // When
      DiffUtils.removeKeysRecursively(input, ["id"]);

      // Then
      expect(input).toEqual(clonedInput);
    });

    it("should remove the specified key from a single leveled object", () => {
      // Given
      const input = {
        id: 1234,
        forename: "John",
        surname: "Smith",
      };

      // When
      const actual = DiffUtils.removeKeysRecursively(input, ["id"]);

      // Then
      const expected = {
        forename: "John",
        surname: "Smith",
      };

      expect(actual).toEqual(expected);
    });

    it("should remove the specified key from a nested object", () => {
      // Given
      const input = {
        id: 1234,
        forename: "John",
        surname: "Smith",
        company: {
          name: "Johns Supermarket",
        },
      };

      // When
      const actual = DiffUtils.removeKeysRecursively(input, ["name"]);

      // Then
      const expected = {
        id: 1234,
        forename: "John",
        surname: "Smith",
        company: {},
      };

      expect(actual).toEqual(expected);
    });

    it("should remove the specified key -- when value is an object", () => {
      // Given
      const input = {
        id: 1234,
        forename: "John",
        surname: "Smith",
        company: {
          name: "Johns Supermarket",
        },
      };

      // When
      const actual = DiffUtils.removeKeysRecursively(input, ["company"]);

      // Then
      const expected = {
        id: 1234,
        forename: "John",
        surname: "Smith",
      };

      expect(actual).toEqual(expected);
    });

    it("should remove the specified key -- when value is an array", () => {
      // Given
      const input = {
        id: 1234,
        forename: "John",
        surname: "Smith",
        hobbies: ["Golf", "Gaming"],
      };

      // When
      const actual = DiffUtils.removeKeysRecursively(input, ["hobbies"]);

      // Then
      const expected = {
        id: 1234,
        forename: "John",
        surname: "Smith",
      };

      expect(actual).toEqual(expected);
    });

    it("should remove the specified key -- when key inside object within an array", () => {
      // Given
      const input = {
        id: 1234,
        forename: "John",
        surname: "Smith",
        friends: [
          {
            id: 2345,
            forename: "Lucy",
            surname: "Somerville",
          },
          {
            id: 2345,
            forename: "Joseph",
            surname: "Allen",
          },
        ],
      };

      // When
      const actual = DiffUtils.removeKeysRecursively(input, ["surname"]);

      // Then
      const expected = {
        id: 1234,
        forename: "John",
        friends: [
          {
            id: 2345,
            forename: "Lucy",
          },
          {
            id: 2345,
            forename: "Joseph",
          },
        ],
      };

      expect(actual).toEqual(expected);
    });
  });
});
