import { triggerAsyncId } from 'async_hooks';
import { StringDecoder } from 'string_decoder';
import stream from 'stream'
import { WriteStream } from 'fs';

class Transform extends stream.Transform {
    _decoder: any
    constructor(options:any = {}) {
        super (options)
    
        // The stream will have Buffer chunks. The
        // decoder converts these to String instances.
        this._decoder = new StringDecoder('utf-8')
    }
  
    _transform (chunk:any, encoding:any, callback:Function | WriteStream) {
        // Convert the Buffer chunks to String.
        // if (encoding === 'buffer') {
        //     chunk = this._decoder.write(chunk)
        // }
    
        // // Exit on CTRL + C.
        // if (chunk === '\u0003') {
        //     process.exit()
        // }
    
        // // Uppercase lowercase letters.
        // if (chunk >= 'a' && chunk <= 'z') {
            chunk = chunk.toUpperCase()
        // }
    
        // Pass the chunk on.
        if(callback instanceof WriteStream){
            chunk.pipe(callback)
        }else{
            callback(null, chunk)
        }
    }
  }
  

export default Transform