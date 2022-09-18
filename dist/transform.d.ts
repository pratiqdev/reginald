/// <reference types="node" />
/// <reference types="node" />
import stream from 'stream';
import { WriteStream } from 'fs';
declare class Transform extends stream.Transform {
    _decoder: any;
    constructor(options?: any);
    _transform(chunk: any, encoding: any, callback: Function | WriteStream): void;
}
export default Transform;
