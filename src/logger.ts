// export const logger = { 
//     debug: (...args: any[]) => { } ,
//     info: (...args: any[]) => { } ,
//     error: console.error,
// };
export const logger = {
    debug: console.debug,
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
};