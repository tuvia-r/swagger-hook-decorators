import * as _ from 'lodash';
import { Schema } from 'swagger-schema-official';
import { DataType, RequestBody } from './swaggerDecorators';
export declare type schemaDict = _.Dictionary<DataType | {
    type: DataType;
    required: boolean;
} | Schema> | Schema | _.Dictionary<{
    [key: string]: Schema;
}>;
/**
 * @description converts a dictionary with value as a type string (key: 'string') to a swagger Schema.properties
 */
export declare const parseSchemeProperties: (schema: schemaDict) => {
    [propertyName: string]: Schema;
};
/**
 *
 * @description parses a schemaDict into a swagger Schema
 */
export declare const parseScheme: (schema?: schemaDict) => Schema;
/**
 * @description creates a swagger request body object with parsed schema
 */
export declare const body: (body: Schema | _.Dictionary<"string" | "number" | "boolean" | "object" | "integer" | "array" | "file" | Schema | {
    type: import("swagger-schema-official").ParameterType;
    required: boolean;
}> | _.Dictionary<{
    [key: string]: Schema;
}> | schemaDict[], options?: {
    description?: string;
    required?: boolean;
}) => RequestBody;
/**
 * creates a swagger body model schema
 */
export declare const bodyModel: (model: string | string[], options?: {
    description?: string;
    required?: boolean;
}) => RequestBody;
/**
 * creates a swagger array of objects response with parsed objects schema
 */
export declare const responseArrayParsed: (code: string | number, options: {
    itemSchema: Schema | _.Dictionary<"string" | "number" | "boolean" | "object" | "integer" | "array" | "file" | Schema | {
        type: import("swagger-schema-official").ParameterType;
        required: boolean;
    }> | _.Dictionary<{
        [key: string]: Schema;
    }> | schemaDict[];
    description: string;
}) => {
    [x: string]: {
        description: string;
        content: {
            'application/json': {
                schema: {
                    type: string;
                    items: {
                        allOf: Schema[];
                    };
                };
            };
        };
    };
};
/**
 * creates a swagger array of objects response
 */
export declare const responseArray: (code: string | number, options: {
    itemSchema: Schema | Schema[];
    description: string;
}) => {
    [x: string]: {
        description: string;
        content: {
            'application/json': {
                schema: {
                    type: string;
                    items: {
                        allOf: Schema[];
                    };
                };
            };
        };
    };
};
/**
 * creates a swagger response with an parsed object schema
 */
export declare const responseObjectParsed: (code: string, options: {
    schema: _.Dictionary<any> | _.Dictionary<any>[];
    description: string;
}) => {
    [x: string]: {
        description: string;
        content: {
            'application/json': {
                schema: {
                    allOf: _.Dictionary<any> | _.Dictionary<any>[];
                };
            };
        };
    };
};
/**
 * creates a swagger response
 */
export declare const responseObject: (code: string, options: {
    schema: _.Dictionary<any> | _.Dictionary<any>[];
    description: string;
}) => {
    [x: string]: {
        description: string;
        content: {
            'application/json': {
                schema: {
                    allOf: _.Dictionary<any> | _.Dictionary<any>[];
                };
            };
        };
    };
};
/**
 * creates a swagger response with a ref schema
 */
export declare const responseRef: (code: string, ref: string, description: string) => {
    [x: string]: {
        description: string;
        content: {
            'application/json': {
                schema: {
                    $ref: string;
                };
            };
        };
    };
};
/**
 * creates a swagger response with a ref to a model schema
 */
export declare const responseModel: (code: string, model: string | string[], description: string) => {
    [x: string]: {
        description: string;
        content: {
            'application/json': {
                schema: {
                    allOf: {
                        $ref: string;
                    }[];
                };
            };
        };
    };
};
/**
 * creates a swagger response with array of items, and ref to a model as the item schema
 */
export declare const responseModelArray: (code: string, model: string | string[], description: string) => {
    [x: string]: {
        description: string;
        content: {
            'application/json': {
                schema: {
                    type: string;
                    items: {
                        allOf: {
                            $ref: string;
                        }[];
                    };
                };
            };
        };
    };
};
