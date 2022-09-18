export var DivTypes;
(function (DivTypes) {
    DivTypes["sm"] = "SMALL";
    DivTypes["md"] = "MEDIUM";
    DivTypes["lg"] = "LARGE";
})(DivTypes || (DivTypes = {}));
function nthIndex(str, pat, n) {
    var L = str.length, i = -1;
    while (n-- && i++ < L) {
        i = str.indexOf(pat, i);
        if (i < 0)
            break;
    }
    return i;
}
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m%s",
    dim: "\x1b[2m%s",
    underscore: "\x1b[4m%s",
    red: "\x1b[31m%s",
    green: "\x1b[32m%s",
    yellow: "\x1b[33m%s",
    blue: "\x1b[34m%s",
    magenta: "\x1b[35m%s",
    cyan: "\x1b[36m%s",
    white: "\x1b[37m%s",
    grey: "\x1b[2m%s",
    RED: "\x1b[31m\x1b[1m%s",
    GREEN: "\x1b[32m\x1b[1m%s",
    YELLOW: "\x1b[33m\x1b[1m%s",
    BLUE: "\x1b[34m\x1b[1m%s",
    MAGENTA: "\x1b[35m\x1b[1m%s",
    CYAN: "\x1b[36m\x1b[1m%s",
    WHITE: "\x1b[37m\x1b[1m%s",
    GREY: "\x1b[2m\x1b[1m%s",
};
class LogItems {
    constructor() {
        this.t = () => ("\x1b[2m" + "|  ".repeat(this.indentWidth) + colors.reset);
        this.str = (x) => (typeof x == "string" ? x : JSON.stringify(x, null, 2));
        this.indent = () => this.indentWidth++;
        this.outdent = () => this.indentWidth--;
        this.setIndent = (n) => (n ? (this.indentWidth = n) : (this.indentWidth = 0));
        this.setDivWidth = (n) => (n ? (this.divWidth = n) : (this.divWidth = this.defaultDivWidth));
        this.div = (type) => {
            switch (type) {
                case 1: return "=".repeat(this.divWidth - (this.indentWidth * 3));
                case 2: return "|".repeat(this.divWidth - (this.indentWidth * 3));
                default: return "-".repeat(this.divWidth - (this.indentWidth * 3));
            }
        };
        this.clear = () => console.clear();
        this.red = (x) => console.log(this.t() + colors.red, this.str(x) !== 'undefined' ? this.str(x) : '', colors.reset);
        this.green = (x) => console.log(this.t() + colors.green, this.str(x) !== 'undefined' ? this.str(x) : '', colors.reset);
        this.yellow = (x) => console.log(this.t() + colors.yellow, this.str(x) !== 'undefined' ? this.str(x) : '', colors.reset);
        this.blue = (x) => console.log(this.t() + colors.cyan, this.str(x) !== 'undefined' ? this.str(x) : '', colors.reset);
        this.white = (x) => console.log(this.t() + colors.white, this.str(x) !== 'undefined' ? this.str(x) : '', colors.reset);
        this.grey = (x) => console.log(this.t() + colors.grey, this.str(x) !== 'undefined' ? this.str(x) : '', colors.reset);
        this.RED = (x) => console.log(this.t() + colors.RED, this.str(x) !== 'undefined' ? this.str(x) : '', colors.reset);
        this.GREEN = (x) => console.log(this.t() + colors.GREEN, this.str(x) !== 'undefined' ? this.str(x) : '', colors.reset);
        this.YELLOW = (x) => console.log(this.t() + colors.YELLOW, this.str(x) !== 'undefined' ? this.str(x) : '', colors.reset);
        this.BLUE = (x) => console.log(this.t() + colors.CYAN, this.str(x) !== 'undefined' ? this.str(x) : '', colors.reset);
        this.WHITE = (x) => console.log(this.t() + colors.WHITE, this.str(x) !== 'undefined' ? this.str(x) : '', colors.reset);
        this.GREY = (x) => console.log(this.t() + colors.GREY, this.str(x) !== 'undefined' ? this.str(x) : '', colors.reset);
        this.table = (x) => console.table(x);
        this.traceColor = (path, line) => {
            console.log(this.t() + '\x1b[36m%s', path, '\x1b[36m\x1b[1m', `(${line})`, colors.reset);
        };
        this.traceSingle = (x, trim) => {
            let arr = x.split('.js:') ?? x.split('.jsx:') ?? x.split('.ts:') ?? x.split('.tsx:');
            let path = arr.shift();
            if (trim) {
                let depth = x.split('/').length - trim;
                if (depth <= 0) {
                    depth = 0;
                }
                path = path.substring(nthIndex(path, '/', depth), path.length);
            }
            let line = arr.join(':').replace(/ /g, '');
            this.traceColor(path, line);
        };
        this.traceMultiple = (x) => {
            let arr = x.split('.js:') ?? x.split('.jsx:') ?? x.split('.ts:') ?? x.split('.tsx:');
            let path = arr.shift();
            let line = arr.join(':').replace(/ /g, '');
            this.traceColor(path, line);
        };
        this.indentWidth = 0;
        this.divWidth = 60;
        this.defaultDivWidth = 60;
    }
}
const items = new LogItems();
export default items;
