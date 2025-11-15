/* eslint-disable @typescript-eslint/no-explicit-any */
const getType = Object.prototype.toString

export function isString(val: any) {
    return getType.call(val) === '[object String]'
}

export function isObject(val: any) {
    return getType.call(val) === '[object Object]'
}

export function isNumber(val: any) {
    return getType.call(val) === '[object Number]'
}

export function isBoolean(val: any) {
    return getType.call(val) === '[object Boolean]'
}

export function isArray(val: any) {
    return getType.call(val) === '[object Array]'
}

export function isDate(val: any) {
    return getType.call(val) === '[object Date]'
}