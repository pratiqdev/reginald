import reginald from './dist/main.js'


export const wait = (time = 1000) =>
    new Promise((res) => {
        setTimeout(()=>{
            res(true)
        },time)
    })



const customOutput = ({data, results, percentage}) => {

let output = 
`# Reginald Results [ ${new Date().toLocaleString()} ] - (CUSTOM STRUCT!)

${percentage == 100 ? `PASSED: ${percentage}%` : `FAILED: ${percentage}%`}

---

Files tested: ${results.files}
Total tests:  ${results.tests}
Tests failed: ${results.failed}
`
    
Object.entries(data).forEach(([NAME, DATA]) => {
    if(Object.entries(DATA).length === 0 || !Object.values(DATA).some((x) => x.condition)) return;

    output += 
`
---

## ${NAME}


    `
    
Object.entries(DATA).forEach(([TEST_NAME, TEST_DATA]) => {
    if(!TEST_DATA || !TEST_DATA.condition) return;

    output += 
`${TEST_NAME}
${TEST_DATA.locations.length ?
    TEST_DATA.locations.map((x, i) => `    ${i+1} - ${x}`).join('\n')
    : '    No matches'}
    
`
})
    
    })
    output += `\n\n\n${JSON.stringify(results)}`
    return output
    
}

const myCustomReginaldMiddleware = async (data) => {
    await wait(2000)
    return {
        middlewareSays: 'okay'
    }
}


let reginaldTest1 = reginald({
    paths: ['files/streamed.md'],
    outputFile: 'reginaldOutput.md',
    // outputStruct: customOutput,
    // middleware: {
        // 'custom-boii': myCustomReginaldMiddleware
    // },
    tests: {

        '1-underscore test': {
            regex:'____',
            max:{
                value:2,
                message: 'No more than 2 matches allowed!!!'
            }
        },

        '2-string match [required]': {
            regex:'ya know',
            min:{
                value: 1,
                message: 'At least one match required!!! (min 0)'
            },
            call: ['3-called by other test']
        },

        '3-called by other test': {
            regex: 'called?',
            max: 0
        }
    }
})



// let result = await pkg.test()
// console.log(result)


reginaldTest1.test()


















// let pkg = reginald({
//     paths: ['files'],
//     ignorePaths: ['sub', /files1/g],
//     types: ['md'],
//     // types: ['md'], // has preference over ignored types
//     // ignoreTypes: ['md', 'py', 'txt'],
//     tests: [
//         // {
//         //     name:'1 - string match (min:{v:1, m:null})',
//         //     regex:'ayooo',
//         //     min:{
//         //         value:1,
//         //     }
//         // },
//         {
//             name:'1 - underscore test',
//             regex:'____',
//             max:{
//                 value:2,
//                 message: 'No more than 2 matches allowed!!!'
//                 // message: (ctx) => `CTX - ${JSON.stringify(ctx)} - CTX`
//             }
//         },
//         {
//             name:'2 - string match (min:{v:1, m:""})',
//             regex:'ya know',
//             max:{
//                 value:2,
//                 message: 'No more than 2 matches allowed!!!'
//                 // message: (ctx) => `CTX - ${JSON.stringify(ctx)} - CTX`
//             }
//         },
//         // {
//         //     name:'3 - regex match (min:1)',
//         //     regex:/blap/g,
//         //     min: 1
//         // },
//         // {
//         //     name:'4 - regex match (min:{v:1,m:()=>""})',
//         //     regex:/trap/g,
//         //     min: {
//         //         value: 1,
//         //         message: (ctx) => `CTX - ${JSON.stringify(ctx)} - CTX`
//         //     }
//         // },
//     ]
// })
