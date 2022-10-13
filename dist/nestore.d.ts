import EE2 from "eventemitter2";
declare class nestoreClass extends EE2 {
    #private;
    internalStore: any;
    originalStore: any;
    constructor(store?: any);
    set: (path: string | Function, value?: any) => boolean | undefined;
    get: (path?: string | Function) => any;
    reset: () => void;
    get store(): any;
    logStore: () => void;
}
declare const NST: (...store: any) => nestoreClass;
export default NST;
