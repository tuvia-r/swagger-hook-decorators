"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Description(description) {
    return function (target, name, descriptor) {
        if (descriptor) {
            const value = descriptor.value;
            if (!value.swagger) {
                value.swagger = {};
            }
            value.swagger.description = description;
        }
        return descriptor;
    };
}
exports.Description = Description;
function Summary(summary) {
    return function (target, name, descriptor) {
        if (descriptor) {
            const value = descriptor.value;
            if (!value.swagger) {
                value.swagger = {};
            }
            value.swagger.summary = summary;
        }
        return descriptor;
    };
}
exports.Summary = Summary;
function Tag(...tags) {
    return function (target, name, descriptor) {
        var _a;
        if (descriptor) {
            const value = descriptor.value;
            if (!((_a = value) === null || _a === void 0 ? void 0 : _a.swagger)) {
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
exports.Tag = Tag;
function Parameter(...parameters) {
    return function (target, name, descriptor) {
        var _a;
        if (descriptor) {
            const value = descriptor.value;
            if (!((_a = value) === null || _a === void 0 ? void 0 : _a.swagger)) {
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
exports.Parameter = Parameter;
function QueryParam(paramName, options = {}) {
    return function (target, name, descriptor) {
        var _a;
        if (descriptor) {
            const value = descriptor.value;
            if (!((_a = value) === null || _a === void 0 ? void 0 : _a.swagger)) {
                value.swagger = {};
            }
            if (!value.swagger.parameters) {
                value.swagger.parameters = [];
            }
            value.swagger.parameters.push(Object.assign(Object.assign({}, options), { name: paramName, in: 'query', schema: options.schema || { type: options.type || 'string' }, required: !!options.required }));
        }
        return descriptor;
    };
}
exports.QueryParam = QueryParam;
function PathParam(paramName, options = {}) {
    return function (target, name, descriptor) {
        var _a;
        if (descriptor) {
            const value = descriptor.value;
            if (!((_a = value) === null || _a === void 0 ? void 0 : _a.swagger)) {
                value.swagger = {};
            }
            if (!value.swagger.parameters) {
                value.swagger.parameters = [];
            }
            value.swagger.parameters.push(Object.assign(Object.assign({}, options), { name: paramName, schema: options.schema || { type: options.type || 'string' }, in: 'path', required: true }));
        }
        return descriptor;
    };
}
exports.PathParam = PathParam;
function Body(body) {
    return function (target, name, descriptor) {
        if (descriptor) {
            const value = descriptor.value;
            if (!value.swagger) {
                value.swagger = {};
            }
            value.swagger.requestBody = body;
        }
        return descriptor;
    };
}
exports.Body = Body;
function Response(...responses) {
    return function (target, name, descriptor) {
        if (descriptor) {
            const value = descriptor.value;
            if (!value.swagger) {
                value.swagger = {};
            }
            if (!Array.isArray(responses)) {
                responses = [responses];
            }
            if (!value.swagger.responses) {
                value.swagger.responses = {};
            }
            for (const r of responses) {
                if (typeof r !== 'object') {
                    continue;
                }
                const key = Object.keys(r)[0];
                value.swagger.responses[key] = r[key];
            }
        }
        return descriptor;
    };
}
exports.Response = Response;
exports.SwaggerExclude = function (target, name, descriptor) {
    if (descriptor) {
        const value = descriptor.value;
        if (!value.swagger) {
            value.swagger = {};
        }
        value.swagger.exclude = true;
    }
    return descriptor;
};
function SwaggerConfig(options) {
    return function (target, name, descriptor) {
        if (descriptor) {
            const value = descriptor.value;
            value.swagger = options;
        }
        return descriptor;
    };
}
exports.SwaggerConfig = SwaggerConfig;
//# sourceMappingURL=swaggerDecorators.js.map