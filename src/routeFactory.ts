
import {readdirSync} from 'fs'
import { Dictionary } from 'lodash'
const appRoot = require.main?.paths[0].split('node_modules')[0].slice(0, -1)
const baseControllersPath = appRoot + '/api/controllers'

export const routes = () => {
    const files = readdirSync(baseControllersPath)
    const controllers = files.map(f => ({fileName: f, filePath: baseControllersPath}))
    const routes: Dictionary<string> = {}
    for(const file of controllers){
        const fileName = file.fileName
        const filePath = file.filePath

        try{
            // try reading as a dir for nested files
            const files = readdirSync(`${filePath}/${fileName}`)
            controllers.push(...files.map(f => ({fileName: f, filePath: `${filePath}/${fileName}`})))
            continue
        }
        catch(err){
            if(err.message.indexOf('ENOTDIR') < 0){
                console.log(`Error generating routes from decorators for file ${`${filePath}/${fileName}`}:`, err.message)
                throw err
            }
        }
        
        let actions: any
        try{
            actions = require(`${filePath}/${fileName}`)
        }
        catch(error){
            console.log(`Error generating routes for file ${fileName}`, error)
        }

        // Traditional controllers are PascalCased and end with the word "Controller".
        const traditionalRegex = new RegExp('^((?:(?:.*)/)*([0-9A-Z][0-9a-zA-Z_]*))Controller\\..+$');
        if(!actions || !traditionalRegex.test(fileName)){
            continue
        }

        // remove file .ext
        const controller = fileName.split('.')[0]

        for (const action of Object.keys(actions)){
            if(typeof actions[action] === 'function'){
                const basePath = actions[action].basePath
                const method = actions[action].method
                const path = actions[action].path

                if(method && path){
                    routes[`${method} ${basePath}${path}`] = `${controller}.${action}`
                }
            }
        }
        
    }
    return routes
}