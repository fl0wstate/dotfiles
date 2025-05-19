export declare type ParamValidator = (param: unknown) => boolean;
export interface ParamDefinition<T> {
    name: keyof T;
    validate: ParamValidator;
}
export declare type ParamDefinitionList<T> = ParamDefinition<T>[];
