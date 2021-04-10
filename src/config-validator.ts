import Ajv, {ValidateFunction} from "ajv"
import {Configuration} from "./model/configuration/configuration.model";
import {ConfigurationSchema} from "./model/configuration/configuration.schema";

export class ConfigValidator {

    private readonly _validatorFunction: ValidateFunction<Configuration>;
    private readonly _json: JSON;

    constructor(json: JSON) {
        const ajv: Ajv = new Ajv();

        this._validatorFunction = ajv.compile(ConfigurationSchema.schema);
        this._json = json;
    }

    public validate(): boolean {
        return this._validatorFunction(this._json);
    }

    public compile(): { data: Configuration | undefined, errors?: any } {
        if (this.validate()) {
            return {
                data: this._json as any,
                errors: undefined
            }
        }

        return {
            data: undefined,
            errors: this._validatorFunction.errors
        }
    }

}