
export function Path(path: string): ClassDecorator | MethodDecorator{
    return function(target, name, descriptor){
        if(!descriptor){
            const classObj = target as Function
            const properties = Object.getOwnPropertyNames(classObj.prototype)
            const toFilterOut = Object.getOwnPropertyNames(Object.prototype)
            const filtered = properties.filter(p => 
                !toFilterOut.includes(p) 
                && typeof classObj.prototype[p] === 'function'
            )
            for(const property of filtered){
                classObj.prototype[property].basePath = path
            }
            return target
        }
        if(descriptor.value){
            const value = descriptor.value as any
            value.path = path
        }
        return descriptor;
    }
}

export const GET: MethodDecorator = function (target, name, descriptor){
    if (descriptor && descriptor.value) {
        (descriptor.value as any).method = 'GET'
    }
    return descriptor;
}

export const POST: MethodDecorator = function (target, name, descriptor){
    if (descriptor && descriptor.value) {
        (descriptor.value as any).method = 'POST'
    }
    return descriptor;
}

export const DELETE: MethodDecorator= function (target, name, descriptor){
    if (descriptor && descriptor.value) {
        (descriptor.value as any).method = 'DELETE'
    }
    return descriptor;
}

export const PATCH: MethodDecorator= function (target, name, descriptor){
    if (descriptor && descriptor.value) {
        (descriptor.value as any).method = 'PATCH'
    }
    return descriptor;
}


export const PUT: MethodDecorator = function (target, name, descriptor){
    if (descriptor && descriptor.value) {
        (descriptor.value as any).method = 'PUT'
    }
    return descriptor;
}
