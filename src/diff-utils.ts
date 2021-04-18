import { EndpointConfigurationOptions } from "./model/configuration/configuration.model";
const cloneDeep = require("lodash.clonedeep");

export class DiffUtils {
  public static format(obj: any, options?: EndpointConfigurationOptions): any {
    let altered = { ...obj };

    if (!!options?.diff?.ignoreKeys) {
      altered = this.removeKeysRecursively(altered, options.diff.ignoreKeys);
    }

    if (options?.diff?.sortArrays) {
      altered = this.sortArraysRecursively(altered);
    }

    return altered;
  }

  public static sortArraysRecursively(obj: any) {
    if (!!obj) {
      let clonedObj = cloneDeep(obj);

      if (clonedObj instanceof Array) {
        clonedObj.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

        const newArray = [];
        for (let element of clonedObj) {
          newArray.push(this.sortArraysRecursively(element));
        }
        clonedObj = newArray;
      } else if (typeof clonedObj === "object") {
        Object.getOwnPropertyNames(clonedObj).forEach((key) => (clonedObj[key] = this.sortArraysRecursively(clonedObj[key])));
      }

      return clonedObj;
    }

    return obj;
  }

  public static removeKeysRecursively(obj: any, keys: string[]) {
    if (!!obj) {
      let clonedObj = cloneDeep(obj);

      if (clonedObj instanceof Array) {
        const newArray = [];
        for (let element of clonedObj) {
          newArray.push(this.removeKeysRecursively(element, keys));
        }
        clonedObj = newArray;
      } else if (typeof clonedObj === "object") {
        Object.getOwnPropertyNames(clonedObj).forEach((key) => {
          if (keys.indexOf(key) !== -1) delete clonedObj[key];
          else {
            clonedObj[key] = this.removeKeysRecursively(clonedObj[key], keys);
          }
        });
      }

      return clonedObj;
    }

    return obj;
  }
}
