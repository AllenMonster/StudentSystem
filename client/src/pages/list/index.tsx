import React, { useState, useEffect, useCallback, FC } from "react";
import { Input, Modal, Form, InputNumber, Radio, Spin } from "antd";
import { connect } from "dva";
import styles from "./index.less";
// 表格组件
import TableSpecial from "@/pages/components/tables/index";
// 查询条件组件
import DynamicForm from "@/pages/components/dynamicForm/index";
import { isEmpty } from "lodash";
interface Student {
  name: string;
  age: number;
  desc: string;
  status: number;
  _id: string;
}

interface IListPaperProps {
  dispatch?: any;
  loading?: any;
  studentListMod: {
    studentStatus: "1" | "2";
    studentName: string;
    version: number;
    studentDetail: {} | any;
  };
}
const ListView: FC<IListPaperProps> = (props: any) => {
  const [show, setShow] = useState(false);
  const {
    getFieldDecorator,
    validateFieldsAndScroll,
    resetFields
  } = props.form;
  const { studentListMod, dispatch, loading } = props;
  const { studentDetail, version, studentName, studentStatus } = studentListMod;
  const { models } = loading;
  // 页面加载
  const pageLoding: boolean = models.studentListMod;
  // 查询条件
  const searchInfo = {
    studentName,
    version,
    studentStatus
  };

  /**
   * 添加和修改学生
   *
   * @param {Student} recode 学生信息
   */
  const newStudent = (recode: Student): void => {
    if (recode._id) {
      dispatch({
        type: "studentListMod/getStudentDetail",
        payload: recode || {}
      });
    }
    setShow(true);
  };
  /**
   *查询学生列表
   *
   * @param {{}} values 查询条件
   * @param {*} ids 条件的属性名
   */
  const searchOptions = (values: {}, ids: Array<string | any>) => {
    if (!isEmpty(values)) {
      dispatch({
        type: "studentListMod/saveStore",
        payload: values || {}
      });
    }
  };
  /**
   * 删除学生信息
   *
   * @param {Student} recode 学生信息
   */
  const deleteStudent = (recode: Student): void => {
    dispatch({
      type: "studentListMod/deleteStudent",
      payload: recode || {}
    });
  };
  /**
   *  关闭新增、修改学生信息的弹窗
   *
   */
  const onCancel = (): void => {
    setShow(false);
    dispatch({
      type: "studentListMod/saveStore",
      payload: {
        studentDetail: {}
      }
    });
    resetFields();
  };
  /**
   *
   *  新增学生
   */
  const onOk = (): void => {
    validateFieldsAndScroll(
      ["name", "age", "desc", "status"],
      async (errors: any, values: {}) => {
        if (!errors) {
          let student = values || {};
          if (studentDetail._id) {
            student = { ...student, _id: studentDetail._id };
          }
          await dispatch({
            type: studentDetail._id
              ? "studentListMod/updateStudent"
              : "studentListMod/addStudent",
            payload: {
              student
            },
            callback: () => {
              resetFields();
              setShow(false);
            }
          });
        }
      }
    );
  };
  // 新增表格布局
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 }
    }
  };
  // 输入框定义
  const baseInput = ({ name, rules, defaultValue, node }: any) =>
    getFieldDecorator(name, {
      initialValue: defaultValue || "",
      rules
    })(node);
  const NameInput = baseInput({
    name: "name",
    rules: [{ required: true, message: "请输入姓名" }],
    defaultValue: studentDetail.name || "",
    node: <Input placeholder="请输入姓名" />
  });
  const AgeInput = baseInput({
    name: "age",
    rules: [{ required: true, message: "请输入姓名" }],
    defaultValue: studentDetail.age || "",
    node: (
      <InputNumber min={0} placeholder="请填写年龄" style={{ width: "100%" }} />
    )
  });
  const DescInput = baseInput({
    name: "desc",
    rules: [{ required: false, message: "请填写描述" }],
    defaultValue: studentDetail.desc || "",
    node: <Input.TextArea placeholder="请填写描述" />
  });
  const StatusInput = baseInput({
    name: "status",
    rules: [{ required: false, message: "请填写描述" }],
    defaultValue: studentDetail.status || 1,
    node: (
      <Radio.Group>
        <Radio value={1}>启用</Radio>
        <Radio value={2}>禁用</Radio>
      </Radio.Group>
    )
  });

  // 查询条件布局
  const seacharItemLayout = {
    labelCol: {
      xs: { span: 4 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 8 },
      sm: { span: 16 }
    }
  };
  /* 
    xs	<576px 响应式栅格，可为栅格数或一个包含其他属性的对象	number|object	-	
    sm	≥576px 响应式栅格，可为栅格数或一个包含其他属性的对象	number|object	-	
    md	≥768px 响应式栅格，可为栅格数或一个包含其他属性的对象	number|object	-	
    lg	≥992px 响应式栅格，可为栅格数或一个包含其他属性的对象	number|object	-	
    xl	≥1200px 响应式栅格，可为栅格数或一个包含其他属性的对象	number|object	-	
    xxl	≥1600px 响应式栅格，可为栅格数或一个包含其他属性的对象
    */
  const colParam = {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 12 },
    lg: { span: 8 },
    xl: { span: 8 },
    xxl: { span: 8 }
  };
  const btnParam = {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 12 },
    lg: { span: 8 },
    xl: { span: 8 },
    xxl: { span: 8 }
  };
  return (
    <Spin spinning={pageLoding}>
      <div className={styles.box_content}>
        <DynamicForm
          form={props.form}
          formParam={{ ...seacharItemLayout }}
          {...{
            formSubmit: (values: any, ids: []): void => {
              console.log(values, ids);
            },
            formData: {
              row: [
                {
                  rowParam: {},
                  col: [
                    {
                      colParam,
                      // 表单控件
                      controlList: [
                        {
                          // 表单控件类型
                          type: "String",
                          controlItemParam: {
                            id: "studentName",
                            label: "姓名",
                            defaultValue: "",
                            rules: [{ required: false }]
                          }
                        }
                      ]
                    },
                    {
                      colParam,
                      // 表单控件
                      controlList: [
                        {
                          // 表单控件类型
                          type: "Select",
                          controlItemParam: {
                            id: "studentStatus",
                            label: "状态",
                            data: [
                              { label: "全部", value: "" },
                              { label: "启用", value: 1 },
                              { label: "禁用", value: 2 }
                            ],
                            defaultValue: "",
                            rules: [
                              {
                                required: false,
                                message: "请选择状态"
                              }
                            ]
                          }
                        }
                      ]
                    }
                  ],
                  btns: {
                    btnParam,
                    btnList: [
                      {
                        key: "search",
                        text: "查询",
                        actionParam: {
                          type: "primary"
                        },
                        btnAction: searchOptions
                      },
                      {
                        key: "add",
                        text: "新增学生",
                        actionParam: {
                          type: "primary",
                          icon: "plus"
                        },
                        btnAction: newStudent
                      }
                    ]
                  }
                }
              ]
            }
          }}
        />
        <Modal
          visible={show}
          onCancel={onCancel}
          title="新增学生"
          onOk={onOk}
          confirmLoading={pageLoding}
        >
          <Form {...formItemLayout}>
            <Form.Item label="姓名" hasFeedback={true}>
              {NameInput}
            </Form.Item>
            <Form.Item label="年龄" hasFeedback={true}>
              {AgeInput}
            </Form.Item>
            <Form.Item label="描述">{DescInput}</Form.Item>
            <Form.Item label="状态">{StatusInput}</Form.Item>
          </Form>
        </Modal>
        <TableSpecial
          id={"_id"}
          updateStudent={newStudent}
          loading={pageLoding}
          version={version}
          searchInfo={searchInfo}
          dispatch={dispatch}
          spaceMod={studentListMod}
          deleteStudent={deleteStudent}
        />
      </div>
    </Spin>
  );
};
export default connect(({ studentListMod, loading }) => ({
  studentListMod,
  loading
}))(Form.create<any>()(ListView));
