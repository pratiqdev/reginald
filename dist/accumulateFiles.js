import { readdir, realpath, lstat } from 'fs/promises';
import { resolve } from 'path';
import extend from './extend.js';
const log = extend('accumulate');
const accumulateFiles = async (config = { paths: ['.'] }) => {
    log(`Accumulating files...`);
    const __dirname = await realpath('.');
    const DEFAULTS = {
        ignorePaths: ['node_modules'],
        ignoreTypes: ['lock'],
    };
    const SETTINGS = {
        maxDepth: config.maxDepth ?? 1,
        paths: config.paths ?? [__dirname],
        ignorePaths: config.ignorePaths ?? [],
        ignoreTypes: config.ignoreTypes ?? [],
        onlyTypes: config.onlyTypes ?? [],
        modifiedAfter: config.modifiedAfter ?? null,
        modifiedBefore: config.modifiedBefore ?? null,
        createdAfter: config.createdAfter ?? null,
        createdBefore: config.createdBefore ?? null,
    };
    SETTINGS.ignoreTypes.push(...DEFAULTS.ignoreTypes);
    SETTINGS.ignorePaths.push(...DEFAULTS.ignorePaths);
    var dates = {
        convert: function (d) {
            // Converts the date in d to a date-object. The input can be:
            //   a date object: returned without modification
            //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
            //   a number     : Interpreted as number of milliseconds
            //                  since 1 Jan 1970 (a timestamp) 
            //   a string     : Any format supported by the javascript engine, like
            //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
            //  an object     : Interpreted as an object with year, month and date
            //                  attributes.  **NOTE** month is 0-11.
            return (d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0], d[1], d[2]) :
                    //@ts-ignore
                    d.constructor === Number ? new Date(d) :
                        //@ts-ignore
                        d.constructor === String ? new Date(d) :
                            typeof d === "object" ? new Date(d.year, d.month, d.date) :
                                NaN);
        },
        compare: function (a, b) {
            // Compare two dates (could be of any type supported by the convert
            // function above) and returns:
            //  -1 : if a < b
            //   0 : if a = b
            //   1 : if a > b
            // NaN : if a or b is an illegal date
            // NOTE: The code inside isFinite does an assignment (=).
            return (isFinite(a = this.convert(a).valueOf()) &&
                isFinite(b = this.convert(b).valueOf()) ?
                //@ts-ignore
                (a > b) - (a < b) :
                NaN);
        },
        inRange: function (d, start, end) {
            // Checks if date in d is between dates in start and end.
            // Returns a boolean or NaN:
            //    true  : if d is between start and end (inclusive)
            //    false : if d is before start or after end
            //    NaN   : if one or more of the dates is illegal.
            // NOTE: The code inside isFinite does an assignment (=).
            return (isFinite(d = this.convert(d).valueOf()) &&
                isFinite(start = this.convert(start).valueOf()) &&
                isFinite(end = this.convert(end).valueOf()) ?
                start <= d && d <= end :
                NaN);
        }
    };
    let recurseDepth = 0;
    //@                                                                   RECURSIVELY COLLECT FILES 
    const getFiles = async (dir) => {
        let dirStat = await lstat(dir);
        let dirents;
        if (dirStat.isDirectory()) {
            dirents = await readdir(dir, { withFileTypes: true });
        }
        else {
            dirents = [dir];
        }
        const files = await Promise.all(dirents.map(async (dirent) => {
            if (SETTINGS.ignorePaths.includes(dirent)
                || SETTINGS.ignorePaths.includes(dirent.name))
                return [];
            // let resDir
            // try{
            // }catch(err){
            //     console.log(err)
            // }
            const res = resolve(dir === dirent ? '' : dir, dirent.name || dirent);
            let resDir = await lstat(res);
            if (resDir?.isDirectory()) {
                recurseDepth++;
                if (recurseDepth < SETTINGS.maxDepth) {
                    return getFiles(res);
                }
                else {
                    return [];
                }
            }
            else {
                let stats = await lstat(res);
                let split = res.split('.');
                let _type = split[split.length - 1];
                if (split.length > 2) {
                    _type = split[split.length - 2] + '.' + split[split.length - 1];
                }
                let _name = res.split('/').pop();
                return {
                    path: res,
                    name: _name,
                    type: _type,
                    size: stats.size,
                    atime: stats.atime,
                    btime: stats.birthtime,
                    ctime: stats.ctime,
                    mtime: stats.mtime
                };
            }
        }));
        return Array.prototype.concat(...files);
    };
    //@                                                                              FILTER MATCHES 
    const filter = async (dir) => {
        let files = await getFiles(dir);
        files = files.filter(file => {
            if (SETTINGS.ignorePaths.includes(file.name)) {
                return false;
            }
            else if (SETTINGS.onlyTypes.length) {
                if (SETTINGS.onlyTypes.includes(file.type)) {
                    return true;
                }
            }
            else if (SETTINGS.ignoreTypes.includes(file.type)) {
                return false;
            }
            else {
                return true;
            }
        });
        files = files.filter(file => {
            if (SETTINGS.modifiedAfter) {
                return dates.compare(file.mtime, SETTINGS.modifiedAfter) >= 0;
            }
            if (SETTINGS.modifiedBefore) {
                return dates.compare(file.mtime, SETTINGS.modifiedBefore) <= 0;
            }
            if (SETTINGS.createdAfter) {
                return dates.compare(file.btime, SETTINGS.createdAfter) >= 0;
            }
            if (SETTINGS.createdBefore) {
                return dates.compare(file.btime, SETTINGS.createdBefore) <= 0;
            }
            return true;
        });
        return files;
    };
    const files = await Promise.all(SETTINGS.paths.map((path) => {
        return filter(path);
    }));
    const uniqueFiles = [];
    const filePathMap = [];
    files.flat().forEach(file => {
        if (!filePathMap.includes(file.path)) {
            uniqueFiles.push(file);
            filePathMap.push(file.path);
        }
    });
    log(`Accumulated files:\n\t - `, uniqueFiles.map(item => item.path).join('\n\t - '));
    // console.log('1 - ACCUMULATE FILES - DONE')
    return uniqueFiles;
};
export default accumulateFiles;
