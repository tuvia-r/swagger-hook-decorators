import * as _ from 'lodash';
import { Schema } from 'swagger-schema-official';
/**
 * @description converts a dictionary with value as a type string (key: 'string') to a swagger Schema.properties
 */
export declare const parseScheme: (schema: _.Dictionary<any>) => {
    [propertyName: string]: Schema;
};
/**
 * @description helper for swagger
 */
export declare const bodySchema: (body: _.Dictionary<any>) => {
    content: {
        'application/json': {
            schema: Schema;
        };
    };
};
/**
 * creates a swagger body schema
 */
export declare const bodyModelSchema: (model: string) => {
    content: {
        'application/json': {
            schema: Schema;
        };
    };
};
export declare const responseArraySchema: (code: string, options: {
    itemSchema: _.Dictionary<any>;
    description: string;
}) => {
    [x: string]: {
        description: string;
        content: {
            'application/json': {
                schema: {
                    type: string;
                    items: _.Dictionary<any>;
                };
            };
        };
    };
};
export declare const responseObjectSchema: (code: string, options: {
    schema: Schema;
    description: string;
}) => {
    [x: string]: {
        description: string;
        content: {
            'application/json': {
                schema: Schema;
            };
        };
    };
};
export declare const responseRefSchema: (code: string, ref: string, description: string) => {
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
export declare const responseModelSchema: (code: string, model: string | string[], description: string) => {
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
export declare const responseModelArraySchema: (code: string, model: string | string[], description: string) => {
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
