export interface I_MinMaxStruct {
    value: number;
    message?: string | ((ctx:any) => string);
}

export interface I_testStruct {
    regex: string | RegExp;
    regexMods?: string;
    
    name?: string;
    category?: string | number;
    description?: string;
    min?: number | I_MinMaxStruct;
    max?: number | I_MinMaxStruct;
    call?: string[];
}

export interface I_testResultsStruct {
    files: number;
    tests: number;
    failed: number;
    passed: number;
    spellingErrors?: number;
}

export interface I_PKGStruct {
    file_data: any[],
    test_data: { [key: string]: any };
    test_results: I_testResultsStruct,
    meta: any,
}


export interface I_ReginaldConfig {

    /** the paths of files or directories to parse
     * @example
     * ['./file1.md', 'file2','./someDir']
     */
    paths?: any[];
    ignorePaths?: any[];

    
    /** only parse files of these types */
    types?: string[];
    ignoreTypes?: string[];
    

    outputFile?: string;
    outputStruct?: Function;
    
    middleware?: { [key:string]: Function };
    
    spellcheck?: boolean;
    spellcheckBeforeTests?: boolean;
    middlewareBeforeTests?: boolean;
    autoCorrectSpelling?: boolean;

    tests: { [key:string]: I_testStruct }
}

export interface I_outputObject {
    results: I_testResultsStruct;
    data: { [key: string]: any };
    percentage: number;
    outputFileName: string
}

//||  ENUMS  ||||||||||||||||||||||||||||||||||||||||||
export enum E_testTypes {
    BRUTE,
    BY_DIR,
    BY_FILE,
    BY_TYPE,
    DIR_BY_TYPE,
}
