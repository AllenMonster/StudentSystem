import { IConfig } from "umi-types";
import routes from "./config/routes";
import path from "path";
// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  history: "hash", // 默认是 browser
  routes,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      "umi-plugin-react",
      {
        antd: true,
        dva: true,
        dynamicImport: { webpackChunkName: true },
        title: "学生管理系统",
        dll: true,
        locale: {
          enable: true,
          default: "en-US"
        },
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//
          ]
        }
      }
    ]
  ],
  alias: {
    "@": path.resolve(__dirname, "src")
  },
  devtool: false,
  proxy: {
    "/api": {
      changeOrigin: true,
      target: "http://localhost:4000"
    }
  }
};

export default config;
