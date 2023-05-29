function isObject (value) {
  const type = typeof value
  return value !== null && (type === 'object')
}

// { a: [{ b: 2 }] } { a: [{ c: 2 }]} -> { a: [{b:2}, {c:2}]}
// 
// 

/**
 * 
 * @param {Object} source 第一个对象
 * @param {Object} other 第二个对象
 * @returns {Object} 新对象
 * @description 深度合并两个对象(non-destructive)
 * @example merge({a: [{b: 2}] }, { a: [{c: 2}]}) -> {a: [{b:2}, {c:2}]} 或 merge({o: {a: 3}}, {o: {b:4}}) -> {o: {a:3, b:4}}
 */
export const merge = (source, other) => {
  if (!isObject(source) || !isObject(other)) {
    return other === undefined ? source : other
  }
  // 合并两个对象的 key，另外要区分数组的初始值为 []
  return Object.keys({
    ...source,
    ...other
  }).reduce((acc, key) => {
    // 递归合并 value
    acc[key] = merge(source[key], other[key])
    return acc
  }, Array.isArray(source) ? [] : {})
}