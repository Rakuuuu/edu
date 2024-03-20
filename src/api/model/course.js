import http from "@/utils/request";
import config from "@/config";

export default {
  course: {
    list: {
      url: `${config.API_URL}/courseManage/courseList`,
      name: "获取课程列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    detail: {
      url: `${config.API_URL}/courseManage/courseDetail`,
      name: "获取课程详情",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    add: {
      url: `${config.API_URL}/courseManage/addCourse`,
      name: "添加课程信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    update: {
      url: `${config.API_URL}/courseManage/updateCourse`,
      name: "更新课程信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    delete: {
      url: `${config.API_URL}/courseManage/deleteCourse`,
      name: "批量删除课程信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    chooseCourseList: {
      url: `${config.API_URL}/courseManage/getChooseCourseList`,
      name: "获取选课学生列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    deleteChooseInfo: {
      url: `${config.API_URL}/courseManage/removeStudentFromCourse`,
      name: "批量删除课程信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    }
  }
}
