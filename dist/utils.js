"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
/**
 * @description converts a dictionary with value as a type string (key: 'string') to a swagger Schema.properties
 */
exports.parseScheme = (schema) => {
    const res = {};
    const savedKeys = [
        '$ref',
        'type',
        'allOf',
        'additionalProperties',
        'properties',
        'discriminator',
        'readOnly',
        'xml',
        'externalDocs',
        'example',
        'required'
    ];
    if (typeof schema === 'string') {
        return schema;
    }
    for (const k in schema) {
        const key = k;
        if (savedKeys.includes(key)) {
            res[key] = schema[key];
        }
        else if (Array.isArray(schema[key])) {
            res[key] = { type: 'array' };
            if (_.isObject(exports.parseScheme(schema[key][0]))) {
                res[key].items = { properties: exports.parseScheme(schema[key][0]) };
            }
            else {
                res[key].items = { type: schema[key][0] };
            }
        }
        else if (typeof schema[key] === 'object') {
            if (schema[key].properties) {
                res[key] = { properties: exports.parseScheme(schema[key].properties) };
            }
            else if (schema[key].items && !_.isObject(schema[key].items)) {
                res[key] = {
                    type: 'array',
                    items: schema[key].items
                };
            }
            else {
                res[key] = exports.parseScheme(schema[key]);
            }
        }
        else {
            res[key] = { type: schema[key] };
        }
    }
    return res;
};
/**
 * @description helper for swagger
 */
exports.bodySchema = (body) => {
    const properties = exports.parseScheme(body);
    const required = [];
    for (const key in body) {
        if (typeof body[key] === 'object') {
            if (body[key].required) {
                required.push(key);
            }
        }
    }
    const schema = { properties };
    if (required.length > 1) {
        schema.required = required;
    }
    return {
        content: {
            'application/json': {
                schema
            }
        }
    };
};
/**
 * creates a swagger body schema
 */
exports.bodyModelSchema = (model) => {
    return exports.bodySchema({
        $ref: `#/components/schemas/${model.toLowerCase()}-without-required-constraint`,
    });
};
exports.responseArraySchema = (code = '200', options) => {
    const { itemSchema, description } = options;
    return {
        [code]: {
            description,
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: itemSchema,
                    },
                },
            },
        }
    };
};
exports.responseObjectSchema = (code, options) => {
    const { schema, description } = options;
    return {
        [code]: {
            description,
            content: {
                'application/json': {
                    schema,
                },
            },
        }
    };
};
exports.responseRefSchema = (code, ref, description) => {
    return {
        [code]: {
            description,
            content: {
                'application/json': {
                    schema: {
                        $ref: ref
                    },
                },
            },
        }
    };
};
exports.responseModelSchema = (code, model, description) => {
    if (!Array.isArray(model)) {
        model = [model];
    }
    const refs = model.map(m => ({ $ref: `#/components/schemas/${m.toLowerCase()}-without-required-constraint` }));
    return {
        [code]: {
            description,
            content: {
                'application/json': {
                    schema: {
                        allOf: refs
                    },
                },
            },
        }
    };
};
exports.responseModelArraySchema = (code, model, description) => {
    if (!Array.isArray(model)) {
        model = [model];
    }
    const refs = model.map(m => ({ $ref: `#/components/schemas/${m.toLowerCase()}-without-required-constraint` }));
    return {
        [code]: {
            description,
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: {
                            allOf: refs
                        },
                    },
                },
            },
        }
    };
};
//# sourceMappingURL=utils.js.map