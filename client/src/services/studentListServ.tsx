// @ts-ignore
import request from "@/utils/request";
// 查询学生列表
export async function queryStudent(params: any) {
  const { pageNum, pageSize, status, name } = params;
  return request(
    `/api/student/list?pageSize=${pageSize}&pageNum=${pageNum}&name=${name}&status=${status}`,
    { expirys: false }
  );
}
// 查询学生详情
export async function getStudentDetail(params: any) {
  return request(`/api/student/detail?_id=${params._id}`, {
    expirys: false
  });
}
// 添加学生
export async function addStudent(params: any) {
  return request(`/api/student/add`, {
    method: "POST",
    body: params,
    expirys: false
  });
}
// 更新学生信息
export async function updateStudent(params: any) {
  return request(`/api/student/update`, {
    method: "POST",
    expirys: false,
    body: params
  });
}
// 删除学生
export async function deleteStudent(params: any) {
  return request(`/api/student/delete`, {
    method: "DELETE",
    body: params
  });
}
