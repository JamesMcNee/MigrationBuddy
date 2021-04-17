import { DiffUtils } from "../src/diff-utils";

describe("Diff Utils", () => {
  describe("removeKeysRecursively", () => {
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
