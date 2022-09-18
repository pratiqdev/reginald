import fs from 'fs';
import streamFileAndTest from './streamFileAndTest.js';
import accumulateFiles from './accumulateFiles.js';
import extend from './extend.js';
import { errorMsg, defaultIgnoredPaths } from './utils.js';
const log = extend('main');
const reginald = async (config = { tests: {} }) => {
    log('Reginald starting...');
    const settings = {
        paths: config.paths ?? ['.'],
        ignorePaths: config.ignorePaths ?? [],
        types: config.types ?? [],
        ignoreTypes: config.ignoreTypes ?? [],
        outputFile: config.outputFile ?? null,
        outputStruct: config.outputStruct ?? null,
        middleware: config.middleware ?? {},
        spellcheck: config.spellcheck == false ? false : true,
        spellcheckBeforeTests: config.spellcheckBeforeTests == false ? false : true,
        middleWareBeforeTests: config.middlewareBeforeTests == false ? false : true,
        autoCorrectSpelling: config.autoCorrectSpelling == false ? false : true,
    };
    log('SETTINGS:\n', settings);
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const PKG = {
        file_data: [],
        test_data: {},
        test_results: {
            files: 0,
            tests: 0,
            failed: 0,
            passed: 0,
        },
        meta: {
            files_closed: 0,
        }
    };
    const BY_CALL_LIST = [];
    if (!config.tests)
        config.tests = {};
    log('Creating list of "by-call-only" tests');
    Object.entries(config.tests).forEach(([TEST_NAME, TEST_DATA]) => {
        if (TEST_DATA.call) {
            TEST_DATA.call.forEach((called) => {
                if (!BY_CALL_LIST.includes(called)) {
                    BY_CALL_LIST.push(called);
                }
            });
        }
    });
    log(`Adding default paths to ignored list`);
    settings.ignorePaths.push(...defaultIgnoredPaths);
    if (settings.types.length && settings.ignoreTypes.length) {
        errorMsg('ignoreTypes will not be used if types is set');
    }
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
    const delegateTests = async () => {
        PKG.test_results.files = Object.entries(PKG.file_data).length;
        PKG.test_results.tests = Object.entries(config.tests).length * PKG.test_results.files;
        if (PKG.test_results.files === 0) {
            log(`delegateTests | No files found!`);
            return false;
        }
        log(`delegateTests | Testing ${PKG.test_results.files} files`);
        await Promise.all(PKG.file_data.map(async (fileData, index) => {
            log(`>>> STR: ${fileData.path}`);
            let str = await streamFileAndTest(fileData, config.tests, PKG, BY_CALL_LIST, settings);
            log(`<<< STR: ${fileData.path}`);
            return str;
        }));
        log(`Testing done, calling handleOutput...`);
        await handleOutput();
        log(`DELEGATE TESTS : done ${'-'.repeat(60)}`);
        return true;
    };
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const createDefaultOutput = (outputObject) => {
        log('Creating default output...');
        let output = '';
        output =
            `# Reginald Results [ ${new Date().toLocaleString()} ]

${outputObject.percentage == 100 ? `PASSED: ${outputObject.percentage}%` : `FAILED: ${outputObject.percentage}%`}

${'-'.repeat(40)}

Files tested: ${PKG.test_results.files}
Total tests:  ${PKG.test_results.tests}
Tests failed: ${PKG.test_results.failed}
`;
        Object.entries(PKG.test_data).forEach((data) => {
            let NAME = data[0];
            let DATA = data[1];
            if (Object.entries(DATA).length === 0 || !Object.values(DATA).some((x) => x.condition))
                return;
            output +=
                `
${'-'.repeat(40)}

## ${NAME}

`;
            Object.entries(DATA).forEach((testData) => {
                let TEST_NAME = testData[0];
                let TEST_DATA = testData[1];
                if (!TEST_DATA || !TEST_DATA.condition)
                    return;
                output +=
                    `${TEST_NAME}
${TEST_DATA.locations.length ?
                        TEST_DATA.locations.map((x, i) => `    ${i + 1} - ${x}`).join('\n')
                        : '    No matches'}
    
`;
            });
        });
        return output;
    };
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const handleOutput = async () => {
        log(`handleOutput`);
        const outputObject = {
            results: PKG.test_results,
            data: PKG.test_data,
            percentage: Math.round(((PKG.test_results.tests - PKG.test_results.failed) / PKG.test_results.tests) * 100),
            outputFileName: settings.outputFile ?? 'no-output-file'
        };
        if (settings.outputFile) {
            if (typeof settings.outputStruct === 'function') {
                log('Using custom output function...');
                await fs.promises.writeFile(settings.outputFile, settings.outputStruct(outputObject));
            }
            else {
                log('Using default file output struct');
                await fs.promises.writeFile(settings.outputFile, createDefaultOutput(outputObject));
            }
        }
        else {
            console.log(`Reginald\n`);
            console.log(`Files Tested:\n - ${PKG.file_data.map(x => x.path).join('\n\t - ')}`);
            console.log(`Results:\n - ${Object.entries(PKG.test_data).map(([PATH, RES]) => `${PATH}:\n${JSON.stringify(RES, null, 2)}`).join('\n - ')}`);
            console.log(JSON.stringify({
                files: PKG.file_data,
                stats: PKG.test_results,
                results: PKG.test_data
            }, null, 2));
        }
        // await fs.writeFileSync('./full_pkg.json', JSON.stringify(PKG, null, 2))
        log(`Writing "full_pkg.json" for review`);
        await fs.promises.writeFile('./full_pkg.json', JSON.stringify(PKG, null, 2));
        log('Returning from handleOutput');
        return true;
    };
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const test = async () => {
        log(`Running tests...`);
        PKG.file_data = await accumulateFiles({
            paths: settings.paths,
            onlyTypes: settings.types,
            ignorePaths: settings.ignorePaths,
            ignoreTypes: settings.ignoreTypes,
        });
        await delegateTests();
        // await wait(250)
        log(`TEST : done`);
        return PKG;
    };
    const getFiles = () => {
        log('getFiles - returning file data');
        // return Object.keys(PKG.fileData)
        return PKG.file_data;
    };
    const getSettings = () => {
        log('getFiles - returning settings object');
        return settings;
    };
    const getResults = () => {
        log('getResults - returning results object');
        return PKG;
    };
    PKG.file_data = await accumulateFiles({
        paths: settings.paths,
        onlyTypes: settings.types,
        ignorePaths: settings.ignorePaths,
        ignoreTypes: settings.ignoreTypes,
    });
    await delegateTests();
    // await wait(250)
    // log(`TEST : done`)
    return PKG;
    return {
        test,
        getFiles,
        getSettings,
        getResults
    };
};
/*
- TODO:

- handle config object
- handle file parsing and content/meta collection

*/
export default reginald;
