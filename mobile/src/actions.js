export const AUTH_LOAD = 'app/AUTH_LOAD'
export const AUTH_USER_CHANGED = 'app/AUTH_USER_CHANGED'

export const ALERTS_LOAD = 'app/ALERTS_LOAD'
export const ALERTS_LOAD_SUCCESS = 'app/ALERTS_LOAD_SUCCESS'

export function authLoad() {
  return { type: AUTH_LOAD }
}
