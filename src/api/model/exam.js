import http from "@/utils/request";
import config from "@/config";

export default {
  question: {
    list: {
      url: `${config.API_URL}/examManage/getQuestionList`,
      name: "获取题目列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    detail: {
      url: `${config.API_URL}/examManage/getQuestionDetail`,
      name: "获取题目详情",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    delete: {
      url: `${config.API_URL}/examManage/deleteQuestion`,
      name: "更新学院信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    }
  },
  exam: {
    list: {
      url: `${config.API_URL}/examManage/getExamList`,
      name: "获取任务列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    detail: {
      url: `${config.API_URL}/examManage/getExamDetail`,
      name: "获取任务详情",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    delete: {
      url: `${config.API_URL}/examManage/deleteExam`,
      name: "删除任务信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    record: {
      url: `${config.API_URL}/examManage/getExamRecordList`,
      name: "获取任务详情",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    condition: {
      url: `${config.API_URL}/examManage/exportExamReport`,
      name: "获取课程任务情况",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    }
  },
}
