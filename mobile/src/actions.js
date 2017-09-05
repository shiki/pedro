export const SESSION_LOAD = 'app/SESSION_LOAD'
export const SESSION_CHANGED = 'app/SESSION_CHANGED'

export const ALERTS_LOAD = 'app/ALERTS_LOAD'
export const ALERTS_LOAD_SUCCESS = 'app/ALERTS_LOAD_SUCCESS'

export function sessionLoad() {
  return { type: SESSION_LOAD }
}
