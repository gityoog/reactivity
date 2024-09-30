let dev = true
export function isDev() {
  return dev
}

export function setDev(value = true) {
  dev = value
}