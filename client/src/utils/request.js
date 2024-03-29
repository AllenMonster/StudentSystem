const fetch = require("dva").fetch;
import { notification } from "antd";
import hash from "hash.js";

const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。"
};

/**
 *
 *
 * @param {*} response 根据请求信息进行判断
 * @returns
 */
const checkStatus = async response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const errortext = codeMessage[response.status] || response.statusText;
  const { status, msg } = await response.json();
  notification.warn({
    message: "系统提示",
    duration: 3,
    description: msg || errortext
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

/**
 * 缓存设置
 *
 * @param {*} response
 * @param {*} hashcode
 * @returns
 */
const cachedSave = (response, hashcode) => {
  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.match(/application\/json/i)) {
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

/**
 * 返回promise
 *
 * @param  {string} url       请求地址
 * @param  {object} [option]  options入参
 * @return {object}
 */
export default function request(url, option) {
  const options = {
    expirys: true,
    ...option
  };
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : "");
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest("hex");

  const defaultOptions = {
    credentials: "include"
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === "POST" ||
    newOptions.method === "PUT" ||
    newOptions.method === "DELETE"
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        ...newOptions.headers
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      newOptions.headers = {
        Accept: "application/json",
        ...newOptions.headers
      };
    }
  }

  const expirys = options.expirys && 60;
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => cachedSave(response, hashcode)) // 缓存设置
    .then(response => {
      return response.json();
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: "login/logout"
        });
        return;
      }
    });
}
