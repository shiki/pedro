import { number as numberConfig } from '../config'

/**
 * @param {BigNumber} number
 * @return {string}
 */
export function toDisplayFormat(number) {
  return number.toFormat(2)
}

/**
 * @param {BigNumber} number
 * @return {string}
 */
export function toDBFormat(number) {
  return number.toFixed(numberConfig.DECIMAL_PLACES)
}
