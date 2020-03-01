import React from "react";
import { get, isFunction, isEmpty } from "lodash";
import { Form, Row, Col, Button } from "antd";
import String from "@/pages/components/myInput/String";
import MySelect from "@/pages/components/myInput/Select";

const dynamicForm = ({ formData, formSubmit, ...props }: any): any => {
  let html: any = [];
  let inputListId: any = []; //控件id列表
  let tmpProps = { ...props };
  let change = get(tmpProps, "formParam.change", () => {});
  let controlList = (controlItem: {}) => {
    let itemProps = {
      inputType: get(controlItem, "type", "String"),
      form: tmpProps.form,
      ...get(controlItem, "controlItemParam", {}),
      change: (value: any, id: any, event: any, eventData: any) => {
        change(value, id, event, eventData);
        get(controlItem, "controlItemParam.change", () => {})(
          value,
          id,
          event,
          eventData
        );
      }
    };
    let list: any = {
      String: <String {...itemProps} />, //字符串
      Select: <MySelect {...itemProps} /> //下拉选择
    };
    let item = list[get(controlItem, "type", "String")];

    return item;
  };
  let controlFuc = (colItem: any) => {
    let controlData = get(colItem, "controlList", []);
    let controlHtml: any = [];
    controlData.map((controlItem: any, index: number) => {
      //解析控件项，收集id
      let pushItem = () => {
        //收集id，用于表单验证
        let itemid: any = get(controlItem, "controlItemParam.id", "");
        inputListId.push(itemid);
        //解析控件项
        controlHtml.push(
          <Col span={8} {...get(colItem, "colParam", {})} key={itemid || index}>
            {controlList(controlItem)}
          </Col>
        );
      };
      pushItem();
    });
    return controlHtml;
  };
  let colFuc = (colData: any) => {
    let colHtml: any = [];
    colData.map((colItem: any, index: number) => {
      //如果存在节点信息，则直接显示节点
      let childrenHtml: any = get(colItem, "children", "");
      colHtml.push(
        childrenHtml ? (
          <Col
            span={8}
            {...get(colItem, "colParam", {})}
            key={colItem || index}
          >
            {isFunction(childrenHtml) ? childrenHtml() : childrenHtml}
          </Col>
        ) : (
          controlFuc(colItem)
        )
      );
    });
    return colHtml;
  };
  let btnFuc = (btnData: any) => {
    let colHtml: any = [];
    let btnList = get(btnData, "btnList", []);
    btnList.map((btnItem: any, index: number) => {
      const submitOptions = () => {
        const { getFieldsValue } = props.form;
        let values: any;
        if (!isEmpty(inputListId)) {
          values = getFieldsValue(inputListId);
        }
        btnItem.btnAction && btnItem.btnAction(values, inputListId);
      };
      //如果存在节点信息，则直接显示节点
      colHtml.push(
        <Button
          style={{ marginRight: "16px" }}
          onClick={submitOptions}
          key={btnItem.id || index}
          {...get(btnItem, "actionParam", {})}
        >
          {btnItem.text || "查询"}
        </Button>
      );
    });
    return (
      <Col
        span={8}
        {...get(btnData, "btnParam", {})}
        key={get(btnData, "key", "btnItem")}
      >
        <Row justify={get(btnData, "position", "end")} type="flex">
          {colHtml}
        </Row>
      </Col>
    );
  };
  let formParam = get(tmpProps, "formParam", {}); //直接作用在form上的参数
  get(formData, "row", []).map((rowItem: any, index: number) => {
    html.push(
      <Row {...get(rowItem, "rowParam", {})} key={rowItem || index}>
        {colFuc(get(rowItem, "col", []))}
        {btnFuc(get(rowItem, "btns", []))}
      </Row>
    );
  });
  return (
    <div className={"dynamic-form"}>
      <Form {...formParam}>{html}</Form>
    </div>
  );
};
export default dynamicForm;
