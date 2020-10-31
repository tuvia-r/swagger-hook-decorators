"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const appRoot = (_a = require.main) === null || _a === void 0 ? void 0 : _a.paths[0].split('node_modules')[0].slice(0, -1);
const baseControllersPath = appRoot + '/api/controllers';
exports.routes = () => {
    const files = fs_1.readdirSync(baseControllersPath);
    const controllers = files.map(f => ({ fileName: f, filePath: baseControllersPath }));
    const routes = {};
    for (const file of controllers) {
        const fileName = file.fileName;
        const filePath = file.filePath;
        try {
            // try reading as a dir for nested files
            const files = fs_1.readdirSync(`${filePath}/${fileName}`);
            controllers.push(...files.map(f => ({ fileName: f, filePath: `${filePath}/${fileName}` })));
            continue;
        }
        catch (err) {
            if (err.message.indexOf('ENOTDIR') < 0) {
                console.log(`Error generating routes from decorators for file ${`${filePath}/${fileName}`}:`, err.message);
                throw err;
            }
        }
        let actions;
        try {
            actions = require(`${filePath}/${fileName}`);
        }
        catch (error) {
            console.log(`Error generating routes for file ${fileName}`, error);
        }
        // Traditional controllers are PascalCased and end with the word "Controller".
        const traditionalRegex = new RegExp('^((?:(?:.*)/)*([0-9A-Z][0-9a-zA-Z_]*))Controller\\..+$');
        if (!actions || !traditionalRegex.test(fileName)) {
            continue;
        }
        // remove file .ext
        const controller = fileName.split('.')[0];
        for (const action of Object.keys(actions)) {
            if (typeof actions[action] === 'function') {
                const basePath = actions[action].basePath;
                const method = actions[action].method;
                const path = actions[action].path;
                if (method && path) {
                    routes[`${method} ${basePath}${path}`] = `${controller}.${action}`;
                }
            }
        }
    }
    return routes;
};
//# sourceMappingURL=routeFactory.js.map