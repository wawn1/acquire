import { AcquireRequestConfigNoURL } from '../types'
import { deepMerge } from '../utils/utils'

const strats = Object.create(null)
function val2First(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}
function val2Only(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') return val2
}
function deepMergeStrat(val1: any, val2: any): any {
  if (!val1) val1 = {}
  if (!val2) val2 = {}
  return deepMerge(val1, val2)
}
const stratKeysVal2Only = ['url', 'params', 'data']
stratKeysVal2Only.forEach(key => {
  strats[key] = val2Only
})
const stratKeysDeepMerge = ['headers']
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

export default function mergeConfig(
  defaultConfig: AcquireRequestConfigNoURL,
  config?: AcquireRequestConfigNoURL
): AcquireRequestConfigNoURL {
  if (!config) config = {}
  const mergedConfig = Object.create(null)
  for (let key in config) {
    mergeField(key)
  }
  for (let key in defaultConfig) {
    if (!config[key]) mergeField(key)
  }
  function mergeField(key: string) {
    const strat = strats[key] || val2First
    mergedConfig[key] = strat(defaultConfig[key], config![key])
  }
  return mergedConfig
}
