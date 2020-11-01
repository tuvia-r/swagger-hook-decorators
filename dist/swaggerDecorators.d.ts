import { Dictionary } from "lodash";
import * as OpenApi from 'swagger-schema-official';
export declare type DataType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
export interface Example {
    summary?: string;
    description?: string;
    value?: any;
    externalValue?: string;
}
export interface Encoding {
    contentType?: string;
    headers?: Record<string, Parameter | OpenApi.Reference>;
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
}
export interface MediaType {
    schema?: OpenApi.BaseSchema | OpenApi.Reference;
    example?: any;
    examples?: Record<string, Example | OpenApi.Reference>;
    encoding?: Record<string, Encoding>;
}
export interface RequestBody {
    description?: string;
    content: Record<string, MediaType>;
    required?: boolean;
}
export declare type Parameter = OpenApi.Parameter & {
    type: DataType;
    description: string;
};
export interface SwaggerConfig {
    summary?: string;
    description?: string;
    tags?: string[];
    requestBody?: RequestBody;
    parameters?: OpenApi.Parameter[];
    responses?: Dictionary<OpenApi.Response>;
    exclude?: boolean;
}
export interface DescriptorValue {
    swagger?: SwaggerConfig;
}
export declare function Description(description: string): MethodDecorator;
export declare function Summary(summary: string): MethodDecorator;
export declare function Tag(...tags: string[]): MethodDecorator;
export declare function Parameter(...parameters: OpenApi.Parameter[]): MethodDecorator;
export declare function QueryParam(paramName: string, options?: Partial<Parameter>): MethodDecorator;
export declare function PathParam(paramName: string, options?: Partial<Parameter>): MethodDecorator;
export declare function Body(body: RequestBody): MethodDecorator;
export declare function Response(...responses: Dictionary<OpenApi.Response>[]): MethodDecorator;
export declare const SwaggerExclude: MethodDecorator;
export declare function SwaggerConfig(options: SwaggerConfig): MethodDecorator;
