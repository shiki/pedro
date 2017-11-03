/**
 * This file is used to ignore certain packages and files when bundling. It is automatically loaded by react-native
 * 
 * Examples were taken from:
 * 
 * - https://github.com/facebook/react-native/issues/7271#issuecomment-215375355
 * - https://gist.github.com/ndbroadbent/6261dbc0ed60e20a7f71e8987cf18aa7
 * 
 * Note: Changes in the blacklist would generally require a cache reset:
 * 
 * $ yarn run start --reset-cache
 */

const metroBundler = require('metro-bundler')

const blacklist = [/node_modules\/node-fetch\/.*/]

module.exports = {
  getBlacklistRE() {
    return metroBundler.createBlacklist(blacklist)
  }
}
