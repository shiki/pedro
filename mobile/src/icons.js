// Based from https://github.com/wix/react-native-navigation/issues/43#issuecomment-303836492
// Information about Native Navigation and icons here https://wix.github.io/react-native-navigation/#/third-party-libraries-support

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

/**
 * @typedef {Object} Icons
 * @property {object} settings
 */

/** @type {Icons} */
export const icons = {}

const iconDefaults = {
  size: 32,
  color: '#000000'
}

const iconConfig = {
  settings: {
    ...iconDefaults,
    font: SimpleLineIcons,
    size: 20,
    icon: 'settings',
    color: '#616161'
  }
}

// Reverse Object.entries
function entriesToObject(arr) {
  return Object.assign(...arr.map(([key, value]) => ({ [key]: value })))
}

function getSources([name, { font, icon, size, color }]) {
  return font.getImageSource(icon, size, color).then(src => [name, src])
}

export async function loadIcons() {
  const loadedIcons = await Promise.all(Object.entries(iconConfig).map(getSources)).then(
    entriesToObject
  )
  Object.assign(icons, loadedIcons)
  return icons
}
