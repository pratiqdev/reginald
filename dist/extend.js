import debug from 'debug';
const mainLog = debug('reginald');
const extend = (namespace) => mainLog.extend(namespace);
export default extend;
