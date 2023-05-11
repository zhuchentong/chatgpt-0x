/**
 * 货币显示处理
 * @param value
 * @param config
 * @returns
 */
export function toPxString(value: number | string) {
  if (typeof value === 'string') {
    const float = parseFloat(value.toString())

    return isNaN(float) ? value : `${float}px`
  } else {
    return `${value}px`
  }
}
