var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _nestoreClass_instances, _nestoreClass_emit, _nestoreClass_handleEmitAll;
import EE2 from "eventemitter2";
import debug from 'debug';
import _ from 'underscore';
const l = debug('nestore');
// debug.enable('nestore:*')
const log = {
    constr: l.extend('constructor'),
    set: l.extend('set'),
    get: l.extend('get'),
    reset: l.extend('reset'),
    emit: l.extend('emit'),
    emitAll: l.extend('emitAll'),
};
// console.log('NESTORE')
function diff(a, b) {
    var r = {};
    _.each(a, function (v, k) {
        if (b[k] === v)
            return;
        // but what if it returns an empty object? still attach?
        r[k] = _.isObject(v)
            ? diff(v, b[k])
            : v;
    });
    return r;
}
// var emitter = new EE2({
//     // set this to `true` to use wildcards
//     wildcard: false,
//     // the delimiter used to segment namespaces
//     delimiter: '.', 
//     // set this to `true` if you want to emit the newListener event
//     newListener: false, 
//     // set this to `true` if you want to emit the removeListener event
//     removeListener: false, 
//     // the maximum amount of listeners that can be assigned to an event
//     maxListeners: 10,
//     // show event name in memory leak message when more than maximum amount of listeners is assigned
//     verboseMemoryLeak: false,
//     // disable throwing uncaughtException if an error event is emitted and it has no listeners
//     ignoreErrors: false
//   });
class nestoreClass extends EE2 {
    constructor(store = {}) {
        super({
            wildcard: true,
            delimiter: '.'
        });
        _nestoreClass_instances.add(this);
        //&                                                                                             
        this.set = (path, value) => {
            try {
                // const _log = log.extend('set')
                log.set(`Setting "${path}" : "${value}"`);
                if (!path || (typeof path !== 'function' && !value)) {
                    log.set('Incorrect args for "set()". Returning false');
                    return false;
                }
                //+ set(s => s.title = 'value')
                //~ This method of updating the store is not recommended                
                //~ diffing is flawed and does not promote use of wildcard listeners    
                if (typeof path === 'function') {
                    let tempStore = { ...this.internalStore };
                    path(this.internalStore);
                    let changeMap = diff(this.internalStore, tempStore);
                    Object.entries(changeMap).forEach((item) => {
                        // console.log('changeMap:', item)
                        __classPrivateFieldGet(this, _nestoreClass_instances, "m", _nestoreClass_emit).call(this, item[0], item[1]);
                    });
                    return;
                }
                //%             asdffdasasdfsdf                                         
                var schema = this.internalStore; // a moving reference to internal objects within obj
                var pathList = path.split('.');
                pathList = pathList.map(p => p.replace(/"+|`+|'+|]+/gm, '').split('[')).flat();
                var depth = pathList.length;
                for (var i = 0; i < depth - 1; i++) {
                    var elem = pathList[i];
                    if (!schema[elem])
                        schema[elem] = {};
                    schema = schema[elem];
                }
                schema[pathList[depth - 1]] = value;
                __classPrivateFieldGet(this, _nestoreClass_instances, "m", _nestoreClass_emit).call(this, path, value);
                return true;
            }
            catch (err) {
                return false;
            }
        };
        //&                                                                                             
        this.get = (path) => {
            try {
                log.get(`Getting "${path}"`);
                if (!path)
                    return this.internalStore;
                if (typeof path === 'function') {
                    return path(this.internalStore);
                }
                var schema = this.internalStore; // a moving reference to internal objects within obj
                var pathList = path.split('.');
                pathList = pathList.map(p => p.replace(/"+|`+|'+|]+/gm, '').split('[')).flat();
                var depth = pathList.length;
                for (var i = 0; i < depth - 1; i++) {
                    var elem = pathList[i];
                    if (!schema[elem])
                        schema[elem] = {};
                    schema = schema[elem];
                }
                return schema[pathList[depth - 1]];
            }
            catch (err) {
                return undefined;
            }
        };
        //&                                                                                             
        _nestoreClass_handleEmitAll.set(this, () => {
            // const _log = log.extend('$handleEmitAll')
            log.emitAll('Parsing store to emit events');
            const switchRecurseTypes = (key, obj) => {
                log.emitAll(`Recursing thru: ${key}`, obj);
                // isObject = recurse
                if (typeof obj === 'object' && !Array.isArray(obj)) {
                    log.emitAll(`${key} has type "object"`);
                    Object.entries(obj).forEach(([_key, _val]) => {
                        switchRecurseTypes(_key, _val);
                    });
                }
                // isArray - loop
                else if (typeof obj === 'object' && Array.isArray(obj)) {
                    log.emitAll(`${key} has type "array"`);
                    obj.forEach(([_key, _val]) => {
                        switchRecurseTypes(_key, _val);
                    });
                }
                // emit
                else {
                    __classPrivateFieldGet(this, _nestoreClass_instances, "m", _nestoreClass_emit).call(this, key, this.get(key));
                }
            };
            switchRecurseTypes('*', this.internalStore);
        }
        //&                                                                                             
        );
        //&                                                                                             
        this.reset = () => {
            this.internalStore = { ...this.originalStore };
            __classPrivateFieldGet(this, _nestoreClass_instances, "m", _nestoreClass_emit).call(this, 'nestore-reset', this.internalStore);
            __classPrivateFieldGet(this, _nestoreClass_handleEmitAll, "f").call(this);
        };
        this.logStore = () => {
            log.emit('LOG STORE:', this.internalStore);
        };
        log.constr('='.repeat(100));
        log.constr('Creating store');
        if (typeof store !== 'object' || Array.isArray(store)) {
            throw new Error("neStore | Initial store must be of type: object");
        }
        this.internalStore = store;
        this.originalStore = { ...store }; // fake deep clone to break ref
        //$ Not a reliable way to propagate changes to the store
        //$ suggest use of "set()" method when attempting to trigger updates
        // this.onAny((data:any)=>{
        //      console.log('this.onAny => ', data)
        // })
    }
    get store() { return this.internalStore; }
}
_nestoreClass_handleEmitAll = new WeakMap(), _nestoreClass_instances = new WeakSet(), _nestoreClass_emit = function _nestoreClass_emit(key, args) {
    log.emit(`Emitting  "${key}" :`, args);
    this.emit('*', args);
    return this.emit(key, args) || this.emit('', args);
};
const NST = (...store) => new nestoreClass(...store);
export default NST;
