
import * as _ from 'lodash'
import { Schema } from 'swagger-schema-official'
import { DataType, RequestBody } from './swaggerDecorators'

export type schemaDict = _.Dictionary<DataType | {type: DataType, required: boolean} | Schema> | Schema | _.Dictionary<{[key: string]: Schema}>
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
]
/**
 * @description converts a dictionary with value as a type string (key: 'string') to a swagger Schema.properties
 */
export const parseSchemeProperties = (schema: schemaDict): Schema['properties'] => {
    const res: Schema['properties'] = {}
    if(typeof schema === 'string'){
        return schema
    }
    for(const k in schema){
        const key = k as keyof Schema
        if (Array.isArray(schema[key])){
            const all: Schema[] = []
            for(const t of schema[key]){
                if(typeof t === 'object'){
                    all.push(parseScheme(t))
                }
                else{
                    all.push({ type: t })
                }
            }
            res[key] = {
                type: 'array',
                items: {
                    allOf: all
                }
            }
            
        }
        else if(typeof schema[key] === 'object'){
            if(schema[key].properties){
                res[key] = parseScheme(schema[key])
            }
            else if(schema[key].type){
                res[key] = { type: schema[key].type, items: schema[key].items }
            }
            else {
                res[key] = parseSchemeProperties(schema[key])
            }
        }
        else {
            res[key] = { type: schema[key]}
        }
    }
    return res
}

/**
 * 
 * @description parses a schemaDict into a swagger Schema
 */
export const parseScheme = (schema: schemaDict = {}): Schema => {
    const parsed: Schema = {
        properties: schema.properties ? 
            parseSchemeProperties(schema.properties as any) 
            : parseSchemeProperties(schema)
    }
    for (const key of savedKeys){
        (parsed as any)[key] = schema[key as keyof schemaDict]
    }
    if(!parsed.required){
        const required: string[] = []
        for(const k in schema){
            const key = k as keyof schemaDict
            if(typeof schema[key] === 'object'){
                if(schema[key].required){
                    required.push(key)
                }
            }
        }
        if(required.length !== 0){
            parsed.required = required
        }
    }
    return parsed
}

    
/**
 * @description creates a swagger request body object with parsed schema
 */
export const body = (
    body: schemaDict | schemaDict[], 
    options: { 
        description?: string
        required?: boolean
    } = {}
): RequestBody => {
    const {description, required} = options
    if(!Array.isArray(body)){
        body = [body]
    }
    const schemas: Schema[] = []
    for (const bodySchema of body){
        const schema = parseScheme(bodySchema)
        schemas.push(schema)
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
    }
}

/**
 * creates a swagger body model schema 
 */
export const bodyModel = (model: string | string[], options?: { 
    description?: string
    required?: boolean
}) => {
    if(!Array.isArray(model)){
        model = [model]
    }
    const refs = model.map(m => ({
        $ref :`#/components/schemas/${m.toLowerCase()}-without-required-constraint`, 
    }))
    return body(refs, options)
}

/**
 * creates a swagger array of objects response with parsed objects schema
 */
export const responseArrayParsed = (
    code: string | number = '200', 
    options: { 
        itemSchema: schemaDict | schemaDict[], 
        description: string
    }
) => {
    let  { itemSchema, description } = options
    if(!Array.isArray(itemSchema)){
        itemSchema = [itemSchema]
    }
    itemSchema = itemSchema.map((s: _.Dictionary<any>) => parseScheme(s))
    return responseArray(code, {itemSchema, description})
}


/**
 * creates a swagger array of objects response
 */
export const responseArray = (
    code: string | number = '200', 
    options: { 
        itemSchema: Schema | Schema[], 
        description: string
    }
) => {
    let  { itemSchema, description } = options
    if(!Array.isArray(itemSchema)){
        itemSchema = [itemSchema]
    }
    if(!description){
        description = ''
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
    }
}


/**
 * creates a swagger response with an parsed object schema
 */
export const responseObjectParsed = (
    code: string, 
    options: { 
        schema: _.Dictionary<any> | _.Dictionary<any>[], 
        description: string
    }
) => {
    let { schema, description } = options
    if(!Array.isArray(schema)){
        schema = [schema]
    }
    if(description === undefined){
        description = ''
    }
    schema = schema.map((s: _.Dictionary<any>) => parseScheme(s))
    return responseObject(code, {schema, description})
}

/**
 * creates a swagger response
 */
export const responseObject = (
    code: string, 
    options: { 
        schema: _.Dictionary<any> | _.Dictionary<any>[], 
        description: string
    }
) => {
    let { schema, description } = options
    if(!Array.isArray(schema)){
        schema = [schema]
    }
    if(description === undefined){
        description = ''
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
    }
}

/**
 * creates a swagger response with a ref schema
 */
export const responseRef = (code: string, ref: string, description: string) => {
    if(description === undefined){
        description = ''
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
    }
}


/**
 * creates a swagger response with a ref to a model schema
 */
export const responseModel = (code: string, model: string | string[],  description: string) =>{
    if(!Array.isArray(model)){
        model = [model]
    }
    if(description === undefined){
        description = ''
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

/**
 * creates a swagger response with array of items, and ref to a model as the item schema
 */
export const responseModelArray = (code: string, model: string | string[], description: string) => {
    if(!Array.isArray(model)){
        model = [model]
    }
    if(description === undefined){
        description = ''
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