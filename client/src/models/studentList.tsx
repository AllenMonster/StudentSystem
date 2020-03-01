// @ts-ignore
import {
  queryStudent,
  getStudentDetail,
  addStudent,
  deleteStudent,
  updateStudent
} from "@/services/studentListServ";
import { cloneDeep } from "lodash";
import { EffectsCommandMap, Subscription } from "dva";
import { AnyAction, Reducer } from "redux";
export interface StudentListModelState {
  // 当前标签页
  studentDetail: {} | any;
  dataSource: [] | any;
  version: number;
  dataTotal: number;
  studentStatus: string;
  studentName: string;
}
export interface StudentListModelType {
  namespace: "studentListMod";
  state: StudentListModelState;
  effects: any;
  reducers: {
    saveStore: Reducer<StudentListModelState>;
  };
  subscriptions: { setup: Subscription };
}
// 初始默认状态
const defultState = {
  // 当前标签页
  studentDetail: {},
  dataSource: [],
  version: 0,
  dataTotal: 0,
  studentStatus: "",
  studentName: ""
};
const tmpModule: StudentListModelType = {
  namespace: "studentListMod",
  state: cloneDeep(defultState),
  // 入口函数(先执行)
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, query }) => {
        // 页面路由匹配时执行
        if ("" + tmpModule.pathname === "" + pathname) {
          dispatch({ type: "listStore", payload: cloneDeep(defultState) });
          // 执行业务操作
        }
      });
    }
  },
  effects: {
    *queryStudent({ payload, callback }, { call, put, select }) {
      const { pageSize, pageNum, studentStatus, studentName } = payload;
      const params = {
        pageSize,
        pageNum,
        status: studentStatus,
        name: studentName
      };
      const { status, data } = yield call(queryStudent, params);
      if (status === 0) {
        yield put({
          type: "saveStore",
          payload: {
            dataSource: data.list || [],
            dataTotal: data.total || []
          }
        });
      }
      if (callback) {
        callback(data, true);
      }
    },
    *getStudentDetail({ callback, payload }, { call, put, select }) {
      const { _id = "" } = payload;
      const { status, data } = yield call(getStudentDetail, { _id });
      if (status === 0) {
        yield put({
          type: "saveStore",
          payload: {
            studentDetail: data
          }
        });
      }
      if (callback) {
        callback(data, true);
      }
    },
    *deleteStudent({ callback, payload }, { call, put, select }) {
      const { _id = "" } = payload;
      const { status, data } = yield call(deleteStudent, { _id });
      if (status === 0) {
        yield put({
          type: "saveStore",
          payload: {
            version: Math.random()
          }
        });
      }
      if (callback) {
        callback(data, true);
      }
    },
    *updateStudent({ payload, callback }, { call, put, select }) {
      const { student } = payload;
      const { status, data } = yield call(updateStudent, student) || {};
      if (status === 0) {
        yield put({
          type: "saveStore",
          payload: {
            studentDetail: {},
            version: Math.random()
          }
        });
        callback && callback();
      }
    },
    *addStudent({ payload, callback }, { call, put, select }) {
      const { student } = payload;
      const { status, data } = yield call(addStudent, student) || {};
      if (status === 0) {
        yield put({
          type: "saveStore",
          payload: {
            studentDetail: {},
            version: Math.random()
          }
        });
        callback && callback();
      }
    }
  },
  reducers: {
    saveStore(preState, action) {
      return Object.assign({}, preState, action.payload);
    }
  }
};
export default tmpModule;
