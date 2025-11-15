export type ObjectKeys<T extends object> = `${Exclude<keyof T, symbol>}`

/**
 * 获取对象的键
 * @param obj - 包含属性的对象
 * @returns 对象的键数组
 */
export const objectKeys = Object.keys as <Type extends object>(
  value: Type,
) => Array<ObjectKeys<Type>>

/**
 * 获取对象的值
 * @param obj - 包含属性的对象
 * @returns 对象的值数组
 */
export const objectValues = <T extends {}>(obj: T) => Object.values(obj) as (keyof typeof obj)[]

/**
 * 从键值对数组转化成对象
 * @param entries - 键值对数组
 * @returns 包含属性的对象
 */
export const objectFromEntries = <const T extends ReadonlyArray<readonly [PropertyKey, unknown]>>(
  entries: T,
): { [K in T[number] as K[0]]: K[1] } => {
  return Object.fromEntries(entries) as { [K in T[number] as K[0]]: K[1] }
}

/**
 * 从对象中获取键值对数组
 * @param obj - 包含属性的对象
 * @returns 键值对数组
 */
export const objectEntries = <T extends Record<PropertyKey, unknown>>(
  obj: T,
): { [K in keyof T]: [K, T[K]] }[keyof T][] => {
  return Object.entries(obj) as { [K in keyof T]: [K, T[K]] }[keyof T][]
}
