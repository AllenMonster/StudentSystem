import React from "react";
import BaseInput from "./Basics";
import { Select } from "antd";
import { get, cloneDeep } from "lodash";
interface Data {
  value: string | any;
  label: string;
}
const MySelect = (props: any) => {
  let optionHtml: Array<any> = [];
  let tmpProps = { ...props };
  let propsData = get(tmpProps, "data", []);
  propsData.map((item: Data, index: number) => {
    optionHtml.push(
      <Select.Option {...item} key={item.value || index}>
        {item.label}
      </Select.Option>
    );
  });
  tmpProps.children = <Select>{optionHtml}</Select>;
  return BaseInput(tmpProps);
};
export default MySelect;
