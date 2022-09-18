export interface IAccumulateFilesConfig {
    paths: string[];
    ignorePaths?: string[];
    ignoreTypes?: string[];
    onlyTypes?: string[];
    maxDepth?: number;
    modifiedAfter?: string;
    modifiedBefore?: string;
    createdAfter?: string;
    createdBefore?: string;
}
declare const accumulateFiles: (config?: IAccumulateFilesConfig) => Promise<any[]>;
export default accumulateFiles;
