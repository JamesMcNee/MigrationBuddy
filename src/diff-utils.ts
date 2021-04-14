import { EndpointConfigurationOptions } from "./model/configuration/configuration.model";

export class DiffUtils {
  public static format(obj: any, options: EndpointConfigurationOptions): any {
    let altered = { ...obj };

    altered = this.removeKeysRecursively(altered, options?.diff?.ignoreKeys || []);
    if (options?.diff?.sortArrays) {
      altered = this.sortArraysRecursively(altered);
    }

    return altered;
  }

  private static sortArraysRecursively(obj: any) {
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

  private static removeKeysRecursively(obj: any, keys: string[]) {
    if (!obj) {
      return obj;
    }

    if (obj instanceof Array) {
      obj.forEach((item) => this.removeKeysRecursively(item, keys));
    } else if (typeof obj === "object") {
      Object.getOwnPropertyNames(obj).forEach((key) => {
        if (keys.indexOf(key) !== -1) delete obj[key];
        else this.removeKeysRecursively(obj[key], keys);
      });
    }

    return obj;
  }
}
