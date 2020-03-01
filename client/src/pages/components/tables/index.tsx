import React, { useState, useEffect, FC } from "react";
import { Dispatch } from "redux";
import { Table, Popconfirm } from "antd";
interface ITableState {
  id: string;
  version: number;
  updateStudent: any;
  deleteStudent: any;
  loading: boolean;
  searchInfo: {} | any;
  dispatch: Dispatch | any;
  spaceMod: any;
}
const Tables: FC<ITableState> = (props: any) => {
  const {
    id,
    updateStudent,
    searchInfo = {},
    deleteStudent,
    dispatch,
    spaceMod,
    version
  } = props;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const { studentName = "", studentStatus = "" } = searchInfo;
  const { dataSource, dataTotal } = spaceMod;
  useEffect(() => {
    getData();
    setLoading(true);
  }, [studentStatus, studentName, version, pageNum, pageSize]);
  const getData = async () => {
    await dispatch({
      type: "studentListMod/queryStudent",
      payload: {
        studentName,
        studentStatus,
        pageNum,
        pageSize
      }
    });
    setLoading(false);
  };
  const statusType: any = {
    1: "启用",
    2: "禁用"
  };
  const columns: any = [
    {
      title: "学生ID",
      dataIndex: "_id"
    },
    {
      title: "姓名",
      dataIndex: "name"
    },
    {
      title: "年龄",
      dataIndex: "age"
    },
    {
      title: "描述",
      dataIndex: "desc"
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (data: number) => statusType[data] || ""
    },
    {
      title: "操作",
      key: "operation",
      width: 100,
      fixed: "right",
      render: (record: any) => (
        <span>
          {/* tslint:disable-next-line:jsx-no-lambda */}
          <a style={{ marginRight: 10 }} onClick={() => updateStudent(record)}>
            修改
          </a>
          {/* tslint:disable-next-line:jsx-no-lambda */}
          <Popconfirm
            title={`是否${record.name}删除`}
            onConfirm={() => deleteStudent(record)}
          >
            <a>删除</a>
          </Popconfirm>
        </span>
      )
    }
  ];
  const tablePagination = {
    current: pageNum,
    total: dataTotal,
    showTotal: (total: any, range: any) =>
      `总数：${total} 当前：${range[0]}-${range[1]}`,
    pageSize,
    onChange: (pageNum: any, pageSize: any) => {
      setPageSize(pageSize);
      setPageNum(pageNum);
    }
  };
  return (
    <Table
      style={{ marginTop: 16 }}
      bordered={false}
      rowKey={id}
      scroll={{ x: 1000 }}
      columns={columns}
      loading={loading}
      dataSource={dataSource}
      pagination={tablePagination}
      size="small"
    />
  );
};

export default Tables;
