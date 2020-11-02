import { Dictionary } from "lodash";
import * as OpenApi from 'swagger-schema-official'

export type DataType = OpenApi.ParameterType

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
    schema?: OpenApi.Schema | OpenApi.Reference;
    example?: any;
    examples?: Record<string, Example | OpenApi.Reference>;
    encoding?: Record<string, Encoding>;

}

export interface RequestBody {
    description?: string;
    content: Record<string, MediaType>
    required?: boolean;
}

export type Parameter = OpenApi.Parameter & {type: DataType, description: string}

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

export function Description(description: string): MethodDecorator {
  return function (target, name, descriptor) {
    if (descriptor) {
      const value = descriptor.value as DescriptorValue;
      if (!value.swagger) {
        value.swagger = {};
      }
      value.swagger.description = description;
    }
    return descriptor;
  };
}

export function Summary(summary: string): MethodDecorator {
  return function (target, name, descriptor) {
    if (descriptor) {
      const value = descriptor.value as DescriptorValue;
      if (!value.swagger) {
        value.swagger = {};
      }
      value.swagger.summary = summary;
    }
    return descriptor;
  };
}

export function Tag(...tags: string[]): MethodDecorator {
  return function (target, name, descriptor) {
    if (descriptor) {
		const value = descriptor.value as DescriptorValue;
      if (!value?.swagger) {
        value.swagger = {};
      }
      if (!Array.isArray(tags)) {
        tags = [tags];
      }
      if (!value.swagger.tags) {
        value.swagger.tags = [];
      }
      value.swagger.tags.push(...tags);
    }
    return descriptor;
  };
}

export function Param(...parameters: OpenApi.Parameter[]): MethodDecorator {
  return function (target, name, descriptor) {
    if (descriptor) {
		const value = descriptor.value as DescriptorValue;
      if (!value?.swagger) {
        value.swagger = {};
      }
      if (!Array.isArray(parameters)) {
        parameters = [parameters];
      }
      if (!value.swagger.parameters) {
        value.swagger.parameters = [];
      }
      value.swagger.parameters.push(...parameters);
    }
    return descriptor;
  };
}

export function QueryParam(
  paramName: string,
  options: Partial<Parameter> = {}
): MethodDecorator {
  return function (target, name, descriptor) {
    if (descriptor) {
		const value = descriptor.value as DescriptorValue;
      if (!value?.swagger) {
        value.swagger = {};
      }
      if (!value.swagger.parameters) {
        value.swagger.parameters = [];
      }
      value.swagger.parameters.push({
        ...options,
        name: paramName,
        in: 'query',
        schema: (options as any).schema || { type: options.type || 'string' },
        required: !!options.required
      } as OpenApi.Parameter);
    }
    return descriptor;
  };
}

export function PathParam(
  paramName: string,
  options: Partial<Parameter> = {}
): MethodDecorator {
  return function (target, name, descriptor) {
    if (descriptor) {
		const value = descriptor.value as DescriptorValue;
      if (!value?.swagger) {
        value.swagger = {};
      }
      if (!value.swagger.parameters) {
        value.swagger.parameters = [];
      }
      value.swagger.parameters.push({
        ...options,
        name: paramName,
        schema: (options as any).schema || { type: options.type || 'string' },
        in: 'path',
        required: true
      } as OpenApi.Parameter);
    }
    return descriptor;
  };
}

export function Body(body: RequestBody): MethodDecorator {
  return function (target, name, descriptor) {
    if (descriptor) {
		const value = descriptor.value as DescriptorValue;
      if (!value.swagger) {
        value.swagger = {};
      }
      value.swagger.requestBody = body;
    }
    return descriptor;
  };
}

export function Response(...responses: Dictionary<OpenApi.Response>[]): MethodDecorator {
  return function (target, name, descriptor) {
    if (descriptor) {
		const value = descriptor.value as DescriptorValue;
      if (!value.swagger) {
        value.swagger = {};
      }
      if (!Array.isArray(responses)) {
        responses = [responses];
      }
      if (!value.swagger.responses) {
        value.swagger.responses = {};
      }
      for(const r of responses){
        if(typeof r !== 'object'){
          continue
        }
        const key = Object.keys(r)[0]
        value.swagger.responses[key] = r[key]
      }
    }
    return descriptor;
  };
}

export const SwaggerExclude: MethodDecorator = function (
  target,
  name,
  descriptor
) {
  if (descriptor) {
    const value = descriptor.value as DescriptorValue;
    if (!value.swagger) {
      value.swagger = {};
    }
    value.swagger.exclude = true;
  }
  return descriptor;
};

export function SwaggerConfig(options: SwaggerConfig): MethodDecorator {
  return function (target, name, descriptor) {
    if (descriptor) {
		const value = descriptor.value as DescriptorValue;
      value.swagger = options;
    }
    return descriptor;
  };
}
