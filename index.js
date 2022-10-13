import reginald from './dist/main.js'


let res = await reginald({
    paths: ['files'],
    // outputFile: 'reginaldOutput.md',
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

res.files = []
console.log(res)


// let result = await pkg.test()
// console.log(result)



















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
