export const objectsIsEqual = (obj1, obj2) => { // 辅助函数，对比两个对象是否相同 深度
  const keys1 = Object.keys(obj1), keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  let result = true;
  for (let k1 of keys1) {
    let value1 = obj1[k1], value2 = obj2[k1];
    if (value1 === value2) continue;
    else if (typeof value1 === "object" && typeof value2 === "object" && objectsIsEqual(value1, value2)) continue;
    else {
      result = false;
      break;
    }
  }
  return result
}

export const ObjectIsIncludeAndEqual = (parent, children) => { // parent对象 是否 包含 children对象
  const childrenKeys = Object.keys(children);
  let result = true;
  for (let key of childrenKeys) {
    let parentValue = parent[key], childValue = children[key];
    if (parentValue === childValue) continue;
    else if (typeof parentValue === "object" && typeof childValue === "object" && objectsIsEqual(parentValue, childValue)) continue;
    else {
      result = false;
      break;
    }
  }
  return result
}