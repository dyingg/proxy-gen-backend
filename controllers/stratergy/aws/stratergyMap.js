const checkKey = require("./checkKey.js");
const getRegions = require("./getRegions");
const makeProxy = require("./makeproxy");
const createScript = require("./createScript");
const cleanUp = require("./cleanUp");
const destory = require("./deleteproxy");
module.exports = {
  checkKey: checkKey,
  getRegions: getRegions,
  makeProxy,
  startUp: createScript,
  cleanUp,
  destory,
  rateLimit: 500,
  multi: true
};
