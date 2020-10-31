"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Path(path) {
    return function (target, name, descriptor) {
        if (!descriptor) {
            const classObj = target;
            const properties = Object.getOwnPropertyNames(classObj.prototype);
            const toFilterOut = Object.getOwnPropertyNames(Object.prototype);
            const filtered = properties.filter(p => !toFilterOut.includes(p)
                && typeof classObj.prototype[p] === 'function');
            for (const property of filtered) {
                classObj.prototype[property].basePath = path;
            }
            return target;
        }
        if (descriptor.value) {
            const value = descriptor.value;
            value.path = path;
        }
        return descriptor;
    };
}
exports.Path = Path;
exports.GET = function (target, name, descriptor) {
    if (descriptor && descriptor.value) {
        descriptor.value.method = 'GET';
    }
    return descriptor;
};
exports.POST = function (target, name, descriptor) {
    if (descriptor && descriptor.value) {
        descriptor.value.method = 'POST';
    }
    return descriptor;
};
exports.DELETE = function (target, name, descriptor) {
    if (descriptor && descriptor.value) {
        descriptor.value.method = 'DELETE';
    }
    return descriptor;
};
exports.PATCH = function (target, name, descriptor) {
    if (descriptor && descriptor.value) {
        descriptor.value.method = 'PATCH';
    }
    return descriptor;
};
exports.PUT = function (target, name, descriptor) {
    if (descriptor && descriptor.value) {
        descriptor.value.method = 'PUT';
    }
    return descriptor;
};
//# sourceMappingURL=pathDecorator.js.map