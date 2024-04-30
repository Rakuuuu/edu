import http from "@/utils/request";
import config from "@/config";

export default {
  admin: {
    list: {
      url: `${config.API_URL}/adminManage/adminList`,
      name: "获取管理员列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    detail: {
      url: `${config.API_URL}/adminManage/getAdminDetail`,
      name: "获管理员详情",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    add: {
      url: `${config.API_URL}/adminManage/addAdmin`,
      name: "添加管理员信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    update: {
      url: `${config.API_URL}/adminManage/updateAdmin`,
      name: "更新管理员信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    delete: {
      url: `${config.API_URL}/adminManage/deleteAdmins`,
      name: "批量删除管理员",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    }
  },
  teacher: {
    list: {
      url: `${config.API_URL}/teacherManage/teacherList`,
      name: "获取教师列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    detail: {
      url: `${config.API_URL}/teacherManage/getTeacherDetail`,
      name: "获取教师详情",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    add: {
      url: `${config.API_URL}/teacherManage/addTeacher`,
      name: "添加教师信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    update: {
      url: `${config.API_URL}/teacherManage/updateTeacher`,
      name: "更新教师信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    delete: {
      url: `${config.API_URL}/teacherManage/deleteTeachers`,
      name: "批量删除教师",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    getTeacherByNameOrNo: {
      url: `${config.API_URL}/teacherManage/getTeacherByNameOrNo`,
      name: "根教师据名称或编号筛选教师",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    }
  },
  student: {
    list: {
      url: `${config.API_URL}/studentManage/studentList`,
      name: "获取学生列表",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    detail: {
      url: `${config.API_URL}/studentManage/getStudentDetail`,
      name: "获取学生详情",
      get: async function (params) {
        return await http.get(this.url, params);
      }
    },
    add: {
      url: `${config.API_URL}/studentManage/addStudent`,
      name: "添加学生信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    update: {
      url: `${config.API_URL}/studentManage/updateStudent`,
      name: "更新学生信息",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    delete: {
      url: `${config.API_URL}/studentManage/deleteStudents`,
      name: "批量删除学生",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    }
  },
  common: {
    resetUserPassword: {
      url: `${config.API_URL}/common/resetUserPassword`,
      name: "重置用户密码",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    },
    updateAdminPassword: {
      url: `${config.API_URL}/common/updateAdminPassword`,
      name: "修改管理员密码",
      post: async function (params) {
        return await http.post(this.url, params);
      }
    }
  }
}
