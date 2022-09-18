import fs from 'fs'
import { resolve } from 'path';
import extend from './extend.js';
const log = extend('utils')

export const __dirname = fs.realpathSync('.');

export const debugMode = false;

export const debugMsg = (...msg: any[]) => {
    if(debugMode){
        console.log('>>',...msg)
    }
}

export const errorMsg = (...msg: any[]) => {
    log(msg.join('\n'))
    console.log('-- ERROR ---------------------------------')
    console.log(...msg)
    console.log('------------------------------------------\n\n')
}

export const isDir = (path: string) => {
    return fs.lstatSync(process.cwd() + '/' + path).isDirectory() 
}

export const defaultIgnoredPaths = [
    'package.json',
    'package-lock.json',
    'yarn.lock',
    'tsconfig.json',
    'node_modules',
]

type T_IteratorCallback = (value: any, index: number, array: any[]) => any

export const parseEntries = (_object: any, _cb: T_IteratorCallback) => {
    if(!_object){ console.log('parseEntries(_object, _cb) requires [_object:Object] as first argument'); return; }
    if(!_cb){ console.log('parseEntries(_object, _cb) requires [_cb:Function] as second argument argument'); return; }
    Object.entries(_object).forEach(_cb)
}

export const parseKeys = (_object: any, _cb: T_IteratorCallback) => {
    if(!_object){ console.log('parseKeys(_object, _cb) requires [_object:Object] as first argument'); return; }
    if(!_cb){ console.log('parseKeys(_object, _cb) requires [_cb:Function] as second argument argument'); return; }
    Object.keys(_object).forEach(_cb)
}

export const parseValues = (_object: any, _cb: T_IteratorCallback) => {
    if(!_object){ console.log('parseValues(_object, _cb) requires [_object:Object] as first argument'); return; }
    if(!_cb){ console.log('parseValues(_object, _cb) requires [_cb:Function] as second argument argument'); return; }
    Object.values(_object).forEach(_cb)
}


export const noop = () => {}



export const wait = async (time: number = 1000) =>
    new Promise((res) => {
        log(`Waiting ${time / 1000} seconds...`)
        setTimeout(()=>{
            res(true)
        },time)
    })
