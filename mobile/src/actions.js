export const SESSION_LOAD_START = 'app/SESSION_LOAD_START'
export const SESSION_TOKEN_LOAD_START = 'app/SESSION_TOKEN_LOAD_START'
export const SESSION_TOKEN_LOAD_SUCCESS = 'app/SESSION_TOKEN_LOAD_SUCCESS'

export const ALERTS_LOAD = 'app/ALERTS_LOAD'
export const ALERTS_LOAD_SUCCESS = 'app/ALERTS_LOAD_SUCCESS'

export function sessionLoad() {
  return { type: SESSION_LOAD_START }
}
