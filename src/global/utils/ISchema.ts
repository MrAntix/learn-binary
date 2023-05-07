import { ISchemaParser } from "./ISchemaParser";

export type ISchema<T> = {
    [n in keyof T]?: ISchema<T[n]> | ISchemaParser;
}
