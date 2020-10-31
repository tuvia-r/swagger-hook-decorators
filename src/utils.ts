
import * as _ from 'lodash'
import { Schema } from 'swagger-schema-official'

/**
 * @description converts a dictionary with value as a type string (key: 'string') to a swagger Schema.properties
 */
export const parseScheme = (schema: _.Dictionary<any>): Schema['properties'] => {
    const res: Schema['properties'] = {}
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
    ]
    if(typeof schema === 'string'){
        return schema
    }
    for(const k in schema){
        const key = k as keyof Schema
        if(savedKeys.includes(key)){
            res[key] = schema[key]
        }
        else if (Array.isArray(schema[key])){
            res[key] = {type: 'array'}
            if(_.isObject(parseScheme(schema[key][0]))){
                res[key].items = {properties: parseScheme(schema[key][0])}
            }
            else{
                res[key].items = { type: schema[key][0] }
            }
        }
        else if(typeof schema[key] === 'object'){
            if(schema[key].properties){
                res[key] = { properties : parseScheme(schema[key].properties)}
            }
            else if (schema[key].items && !_.isObject(schema[key].items)){
                res[key] = {
                    type: 'array',
                    items: schema[key].items
                }
            }
            else {
                res[key] = parseScheme(schema[key]) as Schema
            }
        }
        else {
            res[key] = { type: schema[key]}
        }
    }
    return res
}

    
/**
 * @description helper for swagger
 */
export const bodySchema = (body: _.Dictionary<any>) => {
    const properties = parseScheme(body)
    const required = []
    for(const key in body ){
        if(typeof body[key] === 'object'){
            if(body[key].required){
                required.push(key)
            }
        }
    }
    const schema: Schema = { properties }
    if(required.length > 1){
        schema.required = required
    }
    return {
    content: {
        'application/json': {
        schema
        }
    }
    }
}

/**
 * creates a swagger body schema
 */
export const bodyModelSchema = (model: string) => {
    return bodySchema({
        $ref :`#/components/schemas/${model.toLowerCase()}-without-required-constraint`, 
    })
}

export const responseArraySchema = (code: string = '200', options: { itemSchema: _.Dictionary<any>, description?: string}) => {
    const  { itemSchema, description } = options
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
    }
}

export const responseObjectSchema = (code: string, options: { schema: Schema, description?: string}) => {
    const  { schema, description } = options
    return {
        [code]: {
            description,
            content: {
                'application/json': {
                    schema,
                },
            },
        }
    }
}

export const responseRefSchema = (code: string, ref: string, description?: string) => {
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
    }
}

export const responseModelSchema = (code: string, model: string | string[],  description?: string) =>{
    if(!Array.isArray(model)){
        model = [model]
    }
    const refs = model.map(m => ({ $ref: `#/components/schemas/${m.toLowerCase()}-without-required-constraint`}))
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
    }
}

export const responseModelArraySchema = (code: string, model: string | string[], description?: string) => {
    if(!Array.isArray(model)){
        model = [model]
    }
    const refs = model.map(m => ({ $ref: `#/components/schemas/${m.toLowerCase()}-without-required-constraint`}))
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
    }
}