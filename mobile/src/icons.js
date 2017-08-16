// Based from https://github.com/wix/react-native-navigation/issues/43#issuecomment-303836492
// Information about Native Navigation and icons here https://wix.github.io/react-native-navigation/#/third-party-libraries-support

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

/**
 * @typedef {Object} Icons
 * @property {object} settings
 * @property {object} add
 */

/** @type {Icons} */
export const icons = {}

const iconConfig = {
  settings: {
    font: SimpleLineIcons,
    size: 20, // This is automatically scaled to @2x. In this case, the image will be 40px
    icon: 'settings',
    color: '#616161'
  },
  add: {
    font: MaterialIcons,
    size: 24,
    icon: 'add-circle-outline',
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
