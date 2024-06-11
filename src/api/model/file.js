import http from "@/utils/request";
import config from "@/config";

export default {
  file: {
    list: {
      url: `${config.API_URL}/fileManage/getFileList`,
      name: "获取文件列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    delete: {
      url: `${config.API_URL}/fileManage/deleteFile`,
      name: "删除文件",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    courseFileList: {
      url: `${config.API_URL}/fileManage/getCourseFile`,
      name: "获取课程文件列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    deleteCourseFile: {
      url: `${config.API_URL}/fileManage/deleteCourseFile`,
      name: "删除课程文件",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    uploadStatic: {
      url: `${config.API_URL}/file/uploadFile`,
      name: "上传静态资源文件",
      post: async function (params) {
        return await http.post(this.url, params, {
        });
      }
    },
    download: {
      url: `${config.API_URL}/fileManage/downloadUserFile`,
      name: "下载用户文件",
      get: async function (params) {
        return await http.get(this.url, params, {
        });
      }
    },
  },
}
