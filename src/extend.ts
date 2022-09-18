import debug from 'debug'
const mainLog = debug('reginald')
const extend = (namespace:string) => mainLog.extend(namespace)
export default extend