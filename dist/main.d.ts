import { I_ReginaldConfig, I_PKGStruct } from './interfaces.js';
declare const reginald: (config?: I_ReginaldConfig) => Promise<I_PKGStruct | {
    test: () => Promise<I_PKGStruct>;
    getFiles: () => any[];
    getSettings: () => {
        paths: any[];
        ignorePaths: any[];
        types: string[];
        ignoreTypes: string[];
        outputFile: string | null;
        outputStruct: Function | null;
        middleware: {
            [key: string]: Function;
        };
        spellcheck: boolean;
        spellcheckBeforeTests: boolean;
        middleWareBeforeTests: boolean;
        autoCorrectSpelling: boolean;
    };
    getResults: () => I_PKGStruct;
}>;
export default reginald;
