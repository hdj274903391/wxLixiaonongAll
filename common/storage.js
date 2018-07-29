const constant = require("./constant.js");

const opoen_id_key = ('opoen_id_' + constant.version);
const token_key = ('token_' + constant.version);
const provice_key = ('provice' + constant.version);
const member_avatar_path_key = ('member_avatar_path_' + constant.version);
const member_nick_name_key = ('member_nick_name_' + constant.version);
const latitude_key = ('latitude_' + constant.version);
const longitude_key = ('longitude_' + constant.version)
function getIsLanuch() {
  var is_lanuch = wx.getStorageSync('is_lanuch');

  if (is_lanuch == "") {
    return false;
  }

  return is_lanuch;
}

function setIsLanuch() {
  wx.setStorageSync('is_lanuch', true);
}

function getOpenId() {
  return wx.getStorageSync(opoen_id_key);
}

function setOpenId(opoen_id) {
  wx.setStorageSync(opoen_id_key, opoen_id);
}
function getLatitude() {
  return wx.getStorageSync(latitude_key);
}

function setLatitude(latitude) {
  wx.setStorageSync(latitude_key, latitude);
}
function getLongitude() {
  return wx.getStorageSync(longitude_key);
}

function setLongitude(longitude) {
  wx.setStorageSync(longitude_key, longitude);
}

function getToken() {
  return wx.getStorageSync(token_key);
}

function setToken(token) {
  wx.setStorageSync(token_key, token);
}
function getProvice() {
  return wx.getStorageSync(provice_key);
}
function setProvice(provice) {
  wx.setStorageSync(provice_key, provice);
}

function getMemberAvatarPath() {
  return wx.getStorageSync(member_avatar_path_key);
}

function setMemberAvatarPath(member_avatar_path) {
  wx.setStorageSync(member_avatar_path_key, member_avatar_path);
}

function getMemberNickName() {
  return wx.getStorageSync(member_nick_name_key);
}

function setMemberNickName(memberNickName) {
  wx.setStorageSync(member_nick_name_key, memberNickName);
}

module.exports = {
  getIsLanuch: getIsLanuch,
  setIsLanuch: setIsLanuch,
  getOpenId: getOpenId,
  setOpenId: setOpenId,
  getToken: getToken,
  setToken: setToken,
  getProvice: getProvice,
  setProvice: setProvice,
  getMemberAvatarPath: getMemberAvatarPath,
  setMemberAvatarPath: setMemberAvatarPath,
  getMemberNickName: getMemberNickName,
  setMemberNickName: setMemberNickName,
  getLatitude: getLatitude,
  setLatitude: setLatitude,
  getLongitude: getLongitude,
  setLongitude: setLongitude
};