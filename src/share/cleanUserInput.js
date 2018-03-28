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
  const allowedKeys = ['name', 'email', 'fb', 'gg'] // silently ignore other keys
  const newObject = {}
  for (const key of allowedKeys) {
    const str = cleanStr(object[key])
    if (str !== '') newObject[key] = str
  }

  return newObject
}


export function cleanPollObject({ q, o }, initValue = 0) {
  // q for question, o for option which is [String, String, ...]
  // return a new transformed object { q: string: o: [ { k: String, v: Number }, ... ]}
  // return empty {} if not conformant
  if (!q || !Array.isArray(o)) return {}

  q = cleanStr(q)
  if (!q) return {}

  const newArr = []
  const tmpObj = {} // for deduplication
  for (let str of o) {
    str = cleanStr(str)
    if (str && !tmpObj[str]) newArr.push({ k: str, v: initValue })
    tmpObj[str] = true
  }

  if (newArr.length < 2) return {}
  return { q, o: JSON.stringify(newArr) }
}

