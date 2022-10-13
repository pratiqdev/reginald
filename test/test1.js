import assert from 'assert'
import reginald from '../dist/main.js'
import { expect } from 'chai';


const heading = (text) => `${text}\n  ${'-'.repeat(text.length)}`

describe(heading('A | Option testing'), function(){
    this.timeout(60_000)

    it('A.1 | Empty reginald should collect all files in root dir', async () => {
        // let reginaldTest1 = reginald({
        //     paths: ['files/streamed.md'],
        // })
        let res = await reginald({
            ignoreTypes: ['json'],
            // tests: {
            //     'test-a':{
            //         regex: 'f',
            //         max: 2
            //     }
            // }
        })
        // console.log('-'.repeat(80))
        // console.log(res)
        
        
        
        
        
    });

    it('A.2 | Empty reginald should collect all files in root dir', async () => {
        // let reginaldTest1 = reginald({
        //     paths: ['files/streamed.md'],
        // })
        let res = await reginald({
            ignoreTypes: ['json'],
            tests: {
                'test-a':{
                    regex: 'f',
                    max: 2
                }
            }
        })
        // console.log('-'.repeat(80))
        console.log(res)
        
        
        
        
        
    });

});
