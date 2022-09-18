//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//! have to create a custom transform stream that can be used with pipe
//! most of the functions here can probably be moved to this transform stream

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


import fs from 'fs'
import SpellChecker from 'spellchecker'
import { E_testTypes, I_PKGStruct, I_ReginaldConfig, I_testStruct } from './interfaces.js'
import { parseEntries } from './utils.js'
import transform from './transform.js'
import stream from 'stream'
import extend from './extend.js'

const log = extend('stream')


const streamFileAndTest = (_file_data: any, _tests: any, PKG: I_PKGStruct, BY_CALL_LIST: string[], settings: any) => {
    return new Promise((res, rej)=>{

        const stream = fs.createReadStream(_file_data.path, { highWaterMark: 10_485_760 })

        log(`Streaming file: ${_file_data.name}`)
      



        const break_char = /\n|\r|\r\n/g

        // let isDone = false    
        let prevChunk: any
        let tempChunk: any
        // let chunkIndex = 0

        let totalCumulativeLineBreaks = 1
        // let startingIndexOfCurrentChunk = 0
        let startingIndexOfLastChunk = 0
        let totalCumulativeIndex = 0
        // let number_of_matches = 0
        let mapTestToMatches:any = {}
        let wordRefs:any[] = []
        let mapWordRef:any = {}
        let mapWordRefUnique:any = {}
        // let match_array:any[] = []
        let matchRefs:any[] = []
        let mapLineBreaksToIndex: any = {}
        let mapFailedFileToTest:any = {}
        // let CONDITION:any[] = []

        let spellCheckerResults:any = []
        
        
        
        let testResults:any = {}


        let chunkString: string
        let tempChunkString: string
        // let prevChunkString: string
        let bcf: any


        // if(settings.middleWareBeforeTests){

        //     await Promise.all(
        //         Object.entries(settings.middleware).map(async ([MW_NAME, MW_FUNC]:any) => {
        //             testResults[MW_NAME] = await MW_FUNC({
        //                 file: _file_data,
        //                 tests: _tests
        //             })
        //         })
        //     )
        // }

        
        const runTest = async (test:any, data: any = false) => {
            
            //$ Get name and data from test - if array
            const TEST_NAME = Array.isArray(test) ? test[0] : test
            const TEST_DATA = Array.isArray(test) ? test[1] : data
            log(`Running test: ${TEST_NAME}`)
            
            //$ Exit if test is 'by_call_only'
            if(BY_CALL_LIST.includes(TEST_NAME) && !data) return;

            
            //$ Add test name object to testResults if does not exist
            if(!(TEST_NAME in testResults)){
                log(`${TEST_NAME} not found in results.. adding new test`)
                testResults[TEST_NAME] = {
                    condition: null,
                    locations: [],
                }
            }



            //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
            //$ Set min / max messages from config or to default

            let MAX: any = null
            let MIN: any = null
            let MAX_MSG: any = null
            let MIN_MSG: any = null

            if('max' in TEST_DATA){ 
                MAX = typeof TEST_DATA.max === 'number' ? TEST_DATA.max : TEST_DATA.max.value
                MAX_MSG = TEST_DATA.max.message || `Found more than maximum of ${MAX}`
            }
            if('min' in TEST_DATA){
                MIN = typeof TEST_DATA.min === 'number' ? TEST_DATA.min : TEST_DATA.min.value
                MIN_MSG = TEST_DATA.min.message || `Found fewer than minimum of ${MIN}`
            }



        
                

            
            //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
            //$ Loop thru all matches is the tempChunk
            
            let match
            let REGEX = TEST_DATA.regex instanceof RegExp ? TEST_DATA.regex : new RegExp(TEST_DATA.regex, 'gm')

            while ((match = REGEX.exec(tempChunk)) !== null){
                
                let matchString = match.toString()
                let workingString = tempChunkString.substring(0, match.index + matchString.length)
                let lastBreakIndex = workingString?.split(break_char)?.pop()?.length || matchString.length - matchString.length
                let actual_index = match.index + startingIndexOfLastChunk
                let actual_line = parseInt(Object.entries(mapLineBreaksToIndex).find(([lb,i]:any) => i <= actual_index)![0] || '1')
                let currentMatchLoc = `${actual_line}:${lastBreakIndex}`
                let currentMatchRef = `${currentMatchLoc}:${matchString}`

                //$ if this match has not been stored yet - store the loc and ref in maps
                if(!matchRefs.includes(currentMatchRef)){
                    
                    if(TEST_NAME in mapTestToMatches){
                        mapTestToMatches[TEST_NAME]++
                    }else{
                        mapTestToMatches[TEST_NAME] = 1
                    }

                    matchRefs.push(currentMatchRef)
                    testResults[TEST_NAME].locations.push(currentMatchLoc)
                }

                match = null
                
            }                                                      


            //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
            //$ Set min / max messages if the condition exists
            //$ and test name does not yet exist in map     

            if (typeof MIN === 'number' && (!(TEST_NAME in mapTestToMatches) || mapTestToMatches[TEST_NAME] < MIN)){
                testResults[TEST_NAME].condition = MIN_MSG
                // log(`Condition reached:`,  testResults[TEST_NAME].condition)
            } else if (typeof MAX === 'number' && mapTestToMatches[TEST_NAME] > MAX){
                testResults[TEST_NAME].condition = MAX_MSG
                // log(`Condition reached:`,  testResults[TEST_NAME].condition)
            }




            //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
            //$ increment failed /passed tests

            if(testResults[TEST_NAME].condition && !mapFailedFileToTest[_file_data.name]){
                PKG.test_results.failed++
                mapFailedFileToTest[_file_data.name] = TEST_NAME
                // log(`Test failed: ${TEST_NAME}`)
            }else{
                PKG.test_results.passed++
                // log(`Test passed: ${TEST_NAME}`)
            }


            
            //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
            //$ run any 'by_call_only' tests if there are any  
            if(testResults[TEST_NAME].condition && 'call' in TEST_DATA){
                await Promise.all(TEST_DATA.call.map((testName:string) => {
                    if(testName in _tests){
                        log(`byCallOnly: Triggered by: ${testResults[TEST_NAME].condition }`)
                        log(`byCallOnly: Calling function: ${testName}`)
                        return runTest(testName, _tests[testName])
                    }
                }))
            }
        }




        
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        stream.on('data', (chunk:any) => {
            log(`>>> ${_file_data.name} | ${chunk.length}`)


            //$ concat the new chunk and previous chunk - convert to strings                        
            tempChunk = prevChunk ? Buffer.concat([prevChunk, chunk]) : chunk
            chunkString = chunk.toString()
            tempChunkString = tempChunk?.toString()

            //$ search for and count line breaks - create a map of line breaks to char index        
            while ((bcf = break_char.exec(chunkString)) !== null){
                totalCumulativeLineBreaks++
                mapLineBreaksToIndex[totalCumulativeLineBreaks] = (bcf.index + totalCumulativeIndex)
            }

  


            const runSpellChecker = () => {
                const _log = extend('spell')
                _log(`running spell checker...`)
                try{
                    //$ get {start, end} indices from spellchecker
                    let SC_results = SpellChecker.checkSpelling(tempChunkString)
    
                    //$ Find location of and correction for the spelling error 
                    // _log(`Results: `, SC_results)
                    SC_results.forEach((res:any) => {

    
                        let wordFound =  tempChunkString.substring(res.start, res.end)
                        let workingString = tempChunkString.substring(0, res.start + wordFound.length)
                        let lastBreakIndex = workingString?.split(break_char)?.pop()?.length || wordFound.length - wordFound.length
                        let actual_index = res.start + startingIndexOfLastChunk
                        let line_find = Object.entries(mapLineBreaksToIndex).find( ([lb,i]:any) => i <= actual_index) ?? ['1']
                        let actual_line = parseInt(line_find[0])
                        let currentWordLoc = `${actual_line}:${actual_index}`
                        let currentWordRef = `${currentWordLoc}:${wordFound}`
                        let suggestions = SpellChecker.getCorrectionsForMisspelling(wordFound)

                        // if(wordFound.length > 0 && suggestions.length && settings.autoCorrectSpelling){
                        // 
                        // }
    
    
                        if(!(currentWordRef in mapWordRef)){
                            // wordRefs.push(currentWordRef)
                            mapWordRef[currentWordRef] = true

                            // log(`Found misspelled word: ${word}`)
    
                            spellCheckerResults.push({
                                word: wordFound,
                                line: actual_line,
                                index: actual_index,
                                location: currentWordLoc,
                                suggestions
                            })
                        }

                        if(!(wordFound in mapWordRefUnique)){
                            log(`Unique word found: ${wordFound}`)
                            mapWordRefUnique[wordFound] = true
                        }
                        
                    })

    
    
                }catch(err){
                    _log('spell checker error:', err)
                }
            }



            if(settings.spellcheck){
                if(settings.spellcheckBeforeTests){
                    runSpellChecker()
                    parseEntries(_tests, runTest)
                }else{
                    parseEntries(_tests, runTest)
                    runSpellChecker()

                }
            }else{
                parseEntries(_tests, runTest)
            }
            

            
       
            
            prevChunk = chunk
            startingIndexOfLastChunk += tempChunkString.length - chunkString.length
            totalCumulativeIndex += chunkString.length
            
        })

    
    
    
    
    
    
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        stream.on('close', async () => {
            log(`Stream closed: ${_file_data.path}`)

            PKG.meta.files_closed++

            //& await all middlewares                                                               
            if(!settings.middleWareBeforeTests){

                await Promise.all(
                    Object.entries(settings.middleware).map(async ([MW_NAME, MW_FUNC]:any) => {
                        testResults[MW_NAME] = await MW_FUNC({
                            file: _file_data,
                            tests: _tests
                        })
                    })
                )
            }

            testResults['spellchecker'] = spellCheckerResults

            PKG.test_data[_file_data.name] = testResults

            PKG.test_results.spellingErrors += spellCheckerResults.length


            
            if(totalCumulativeIndex <= 1){
                log('Total cumulative index <= 1... setting test_data[file_name] to empty object {}')
                PKG.test_data[_file_data.name] = {}
            }


            if(PKG.meta.files_closed === PKG.test_results.files){
                log(`STREAMING : done ${'-'.repeat(60)}`)
                // await handleOutput()
                // res(true)
                // return true
            }
            res(true)
        })

        // stream.on('error', () => { res(false) })
        // res(true)
    })


}

export default streamFileAndTest



















// streamFileAndTest('./files/streamed.md')



/*
chunk1 --------------

ab
cd
ef

chunk2 --------------

gh    # |
ij      |
kl      |


chunk3 --------------

mn      |
op    $ |
qr      |


! FIND "op"

? tempChunk = |

? The tempChunk starts at i7 (#)
? which is lb4
? meaning tempChunk has lb6 total
? and ch12
? match would be found at i9 ($)
? at lb5

? lb5 is really lb8





*/