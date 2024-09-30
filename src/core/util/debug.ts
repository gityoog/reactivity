import config from '../config'
import { noop } from '../../shared/util'
import type { Component } from '../../types/component'
import { isDev } from './isDev'

export let warn: (msg: string, vm?: Component | null) => void = noop
export let tip = noop

if (isDev()) {
  const hasConsole = typeof console !== 'undefined'

  warn = (msg, vm = null) => {
    const trace = ''

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace)
    } else if (hasConsole && !config.silent) {
      console.error(`[Vue warn]: ${msg}${trace}`)
    }
  }

  tip = (msg, vm) => {
    if (hasConsole && !config.silent) {
      console.warn(`[Vue tip]: ${msg}`)
    }
  }
}
