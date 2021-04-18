import { EndpointConfigurationOptions } from "./model/configuration/configuration.model";
const cloneDeep = require("lodash.clonedeep");

export class DiffUtils {
  public static format(obj: any, options: EndpointConfigurationOptions): any {
    let altered = { ...obj };

    altered = this.removeKeysRecursively(altered, options?.diff?.ignoreKeys || []);
    if (options?.diff?.sortArrays) {
      altered = this.sortArraysRecursively(altered);
    }

    return altered;
  }

  public static sortArraysRecursively(obj: any) {
    if (!obj) {
      return obj;
    }

    if (obj instanceof Array) {
      obj.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
      obj.forEach((item) => this.sortArraysRecursively(item));
    } else if (typeof obj === "object") {
      Object.getOwnPropertyNames(obj).forEach((key) => this.sortArraysRecursively(obj[key]));
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
