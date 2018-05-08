export function cleanStr(str) {
  return str === null ?
    null :
    typeof str !== 'string' ? '' : str.trim()
}

export function cleanArr(arr) {
  if (!Array.isArray(arr)) return []
  return arr.map(d => cleanStr(d)).filter(d => d)
}

// export function arrayToObj(arr, initValue = 0) {
//   if (!Array.isArray(arr)) return {}
//   const newO = {}
//   for (const key of arr) {
//     const cleaned = cleanStr(key)
//     if (cleaned) newO[cleaned] = initValue
//   }
//   return newO
// }

export function cleanUserObject(object = {}) {
  const allowedKeys = ['name', 'email', 'gh', 'fb', 'gg'] // silently ignore other keys
  const newObject = {}
  for (const key of allowedKeys) {
    const str = cleanStr(object[key])
    if (str !== '') newObject[key] = str
  }

  return newObject
}


export function cleanPollObject({ q, o }) {
  q = q.trim()
  if (q === '' || o.length === 0) return undefined

  const tmpObj = {}
  const newArr = []
  for (let str of o) {
    str = str.trim()
    if (str !== '' && !tmpObj[str]) newArr.push(str)
    tmpObj[str] = true
  }

  if (newArr.length < 2) return undefined
  return { q, o: newArr }
}

