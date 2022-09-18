export declare enum DivTypes {
    sm = "SMALL",
    md = "MEDIUM",
    lg = "LARGE"
}
declare class LogItems {
    indentWidth: number;
    divWidth: number;
    defaultDivWidth: number;
    constructor();
    t: () => string;
    str: (x: any) => string;
    indent: () => number;
    outdent: () => number;
    setIndent: (n: number) => number;
    setDivWidth: (n: number) => number;
    div: (type?: number) => string;
    clear: () => void;
    red: (x: any) => void;
    green: (x: any) => void;
    yellow: (x: any) => void;
    blue: (x: any) => void;
    white: (x: any) => void;
    grey: (x: any) => void;
    RED: (x: any) => void;
    GREEN: (x: any) => void;
    YELLOW: (x: any) => void;
    BLUE: (x: any) => void;
    WHITE: (x: any) => void;
    GREY: (x: any) => void;
    table: (x: any) => void;
    traceColor: (path: string, line: string) => void;
    traceSingle: (x: any, trim: number) => void;
    traceMultiple: (x: any) => void;
}
declare const items: LogItems;
export default items;
