import { Input, Form } from "antd";
const FormItem = Form.Item;
import { get } from "lodash";

const inputChangeTypeVal = e => {
  let val = "";
  if (e && e.target) {
    val = e.target.value;
  } else {
    val = e;
  }
  return val;
};

const baseInput = ({
  form,
  id = "",
  rules,
  defaultValue,
  node,
  children,
  change,
  inputType,
  ...tmpProps
}) => {
  let getFieldDecorator = get(form, "getFieldDecorator", () => {});
  return (
    <FormItem {...tmpProps}>
      {getFieldDecorator(id, {
        initialValue: defaultValue || "",
        onChange: (event, eventData) => {
          if (change) {
            change(inputChangeTypeVal(event, eventData), id, event, eventData);
          }
        },
        rules
      })(children || <Input />)}
    </FormItem>
  );
};

export default baseInput;
