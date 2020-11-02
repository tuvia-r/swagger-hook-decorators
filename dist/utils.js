"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const savedKeys = [
    '$ref',
    'allOf',
    'additionalProperties',
    'discriminator',
    'readOnly',
    'xml',
    'externalDocs',
    'example',
    'required',
    'format',
    'title',
    'description',
    'default',
    'multipleOf',
    'maximum',
    'exclusiveMaximum',
    'minimum',
    'exclusiveMinimum',
    'maxLength',
    'minLength',
    'pattern',
    'maxItems',
    'minItems',
    'uniqueItems',
    'maxProperties',
    'minProperties',
    'enum',
    'items',
];
/**
 * @description converts a dictionary with value as a type string (key: 'string') to a swagger Schema.properties
 */
exports.parseSchemeProperties = (schema) => {
    const res = {};
    if (typeof schema === 'string') {
        return schema;
    }
    for (const k in schema) {
        const key = k;
        if (Array.isArray(schema[key])) {
            const all = [];
            for (const t of schema[key]) {
                if (typeof t === 'object') {
                    all.push(exports.parseScheme(t));
                }
                else {
                    all.push({ type: t });
                }
            }
            res[key] = {
                type: 'array',
                items: {
                    allOf: all
                }
            };
        }
        else if (typeof schema[key] === 'object') {
            if (schema[key].properties) {
                res[key] = exports.parseScheme(schema[key]);
            }
            else if (schema[key].type) {
                res[key] = { type: schema[key].type, items: schema[key].items };
            }
            else {
                res[key] = exports.parseSchemeProperties(schema[key]);
            }
        }
        else {
            res[key] = { type: schema[key] };
        }
    }
    return res;
};
/**
 *
 * @description parses a schemaDict into a swagger Schema
 */
exports.parseScheme = (schema = {}) => {
    const parsed = {
        properties: schema.properties ?
            exports.parseSchemeProperties(schema.properties)
            : exports.parseSchemeProperties(schema)
    };
    for (const key of savedKeys) {
        parsed[key] = schema[key];
    }
    if (!parsed.required) {
        const required = [];
        for (const k in schema) {
            const key = k;
            if (typeof schema[key] === 'object') {
                if (schema[key].required) {
                    required.push(key);
                }
            }
        }
        if (required.length !== 0) {
            parsed.required = required;
        }
    }
    return parsed;
};
/**
 * @description creates a swagger request body object with parsed schema
 */
exports.body = (body, options = {}) => {
    const { description, required } = options;
    if (!Array.isArray(body)) {
        body = [body];
    }
    const schemas = [];
    for (const bodySchema of body) {
        const schema = exports.parseScheme(bodySchema);
        schemas.push(schema);
    }
    return {
        content: {
            'application/json': {
                schema: {
                    allOf: schemas
                }
            }
        },
        description,
        required
    };
};
/**
 * creates a swagger body model schema
 */
exports.bodyModel = (model, options) => {
    if (!Array.isArray(model)) {
        model = [model];
    }
    const refs = model.map(m => ({
        $ref: `#/components/schemas/${m.toLowerCase()}-without-required-constraint`,
    }));
    return exports.body(refs, options);
};
/**
 * creates a swagger array of objects response with parsed objects schema
 */
exports.responseArrayParsed = (code = '200', options) => {
    let { itemSchema, description } = options;
    if (!Array.isArray(itemSchema)) {
        itemSchema = [itemSchema];
    }
    itemSchema = itemSchema.map((s) => exports.parseScheme(s));
    return exports.responseArray(code, { itemSchema, description });
};
/**
 * creates a swagger array of objects response
 */
exports.responseArray = (code = '200', options) => {
    let { itemSchema, description } = options;
    if (!Array.isArray(itemSchema)) {
        itemSchema = [itemSchema];
    }
    if (!description) {
        description = '';
    }
    return {
        [code]: {
            description,
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: {
                            allOf: itemSchema
                        },
                    },
                },
            },
        }
    };
};
/**
 * creates a swagger response with an parsed object schema
 */
exports.responseObjectParsed = (code, options) => {
    let { schema, description } = options;
    if (!Array.isArray(schema)) {
        schema = [schema];
    }
    if (description === undefined) {
        description = '';
    }
    schema = schema.map((s) => exports.parseScheme(s));
    return exports.responseObject(code, { schema, description });
};
/**
 * creates a swagger response
 */
exports.responseObject = (code, options) => {
    let { schema, description } = options;
    if (!Array.isArray(schema)) {
        schema = [schema];
    }
    if (description === undefined) {
        description = '';
    }
    return {
        [code]: {
            description,
            content: {
                'application/json': {
                    schema: {
                        allOf: schema
                    },
                },
            },
        }
    };
};
/**
 * creates a swagger response with a ref schema
 */
exports.responseRef = (code, ref, description) => {
    if (description === undefined) {
        description = '';
    }
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
/**
 * creates a swagger response with a ref to a model schema
 */
exports.responseModel = (code, model, description) => {
    if (!Array.isArray(model)) {
        model = [model];
    }
    if (description === undefined) {
        description = '';
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
/**
 * creates a swagger response with array of items, and ref to a model as the item schema
 */
exports.responseModelArray = (code, model, description) => {
    if (!Array.isArray(model)) {
        model = [model];
    }
    if (description === undefined) {
        description = '';
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