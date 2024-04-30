// 静态路由配置
// 书写格式与动态路由格式一致，全部经由框架统一转换
// 比较动态路由在meta中多加入了role角色权限，为数组类型。一个菜单是否有权限显示，取决于它以及后代菜单是否有权限。
// routes 显示在左侧菜单中的路由(显示顺序在动态路由之前)
// 示例如下

const routes = [
  // {
  //   name: "demopage",
  //   path: "/demopage",
  //   component: "test/autocode/index",
  //   meta: {
  //     icon: "el-icon-eleme-filled",
  //     title: "控制台",
  //     affix: true
  //   }
  // },
  {
    path: "/user/resetPassword",
    name: "resetPassword",
    component: 'login/resetPassword.vue',
    meta: {
      title: "修改密码",
      fullpage: true,
      hidden: true
    }
  },
  {
    name: "teacherManage",
    path: "/teacherManage",
    meta: {
      icon: "el-icon-eleme-filled",
      title: "教师管理",
      role: ["SA", "S"]
    },
    children: [{
      name: "teacherList",
      path: "/teacherManage/teacherList",
      component: "teacherManage/teacherList/index",
      meta: {
        icon: "el-icon-menu",
        title: "教师列表",
        role: ["SA", "S"]
      }
    }]
  },
  {
    name: "studentManage",
    path: "/studentManage",
    meta: {
      icon: "el-icon-eleme-filled",
      title: "学生管理",
      role: ["SA", "S"]
    },
    children: [{
      name: "studentList",
      path: "/studentManage/studentList",
      component: "studentManage/studentList/index",
      meta: {
        icon: "el-icon-menu",
        title: "学生列表",
        role: ["SA", "S"]
      }
    }]
  },
  {
    name: "adminManage",
    path: "/adminManage",
    meta: {
      icon: "el-icon-eleme-filled",
      title: "教学秘书管理",
      role: ["SA"]
    },
    children: [{
      name: "adminList",
      path: "/adminManage/adminList",
      component: "adminManage/adminList/index",
      meta: {
        icon: "el-icon-menu",
        title: "管理员列表",
        role: ["SA"]
      }
    }]
  },
  {
    name: "departmentManage",
    path: "/departmentManage",
    meta: {
      icon: "el-icon-eleme-filled",
      title: "院系管理",
      role: ["SA"]
    },
    children: [
      {
        name: "departmentList",
        path: "/departmentManage/departmentList",
        component: "departmentManage/departmentList/index",
        meta: {
          icon: "el-icon-menu",
          title: "学院列表",
          role: ["SA"]
        }
      },
      {
        name: "specialityList",
        path: "/departmentManage/specialityList",
        component: "departmentManage/specialityList/index",
        meta: {
          icon: "el-icon-menu",
          title: "专业列表",
          role: ["SA", "S"]
        }
      }
    ]
  },
  {
    name: "courseManage",
    path: "/courseManage",
    meta: {
      icon: "el-icon-eleme-filled",
      title: "课程管理"
    },
    children: [
      {
        name: "courseList",
        path: "/courseManage/courseList",
        component: "courseManage/courseList/index",
        meta: {
          icon: "el-icon-menu",
          title: "课程列表"
        }
      },
      {
        name: "chooseCourseDetail",
        path: "/courseManage/chooseCourseDetail",
        component: 'courseManage/courseList/component/info.vue',
        meta: {
          icon: "el-icon-menu",
          title: "选课学生列表",
          hidden: true,
          fullpage: true
        }
      },
      {
        name: "courseFileDetail",
        path: "/courseManage/courseFileDetail",
        component: 'courseManage/courseList/component/file.vue',
        meta: {
          icon: "el-icon-menu",
          title: "课程文件列表",
          hidden: true,
          fullpage: true
        }
      },
    ]
  },
  {
    name: "postManage",
    path: "/postManage",
    meta: {
      icon: "el-icon-eleme-filled",
      title: "帖子管理"
    },
    children: [
      {
        name: "postList",
        path: "/postManage/postList",
        component: "postManage/postList/index",
        meta: {
          icon: "el-icon-menu",
          title: "帖子列表"
        }
      },
      {
        name: "postDetail",
        path: "/postManage/postDetail",
        component: 'postManage/postList/component/info.vue',
        meta: {
          icon: "el-icon-menu",
          title: "帖子详情",
          hidden: true,
          fullpage: true
        }
      },
      {
        name: "commentList",
        path: "/postManage/commentList",
        component: "postManage/commentList/index",
        meta: {
          icon: "el-icon-menu",
          title: "评论列表"
        }
      },
    ]
  },
  {
    name: "fileManage",
    path: "/fileManage",
    meta: {
      icon: "el-icon-eleme-filled",
      title: "文件管理"
    },
    children: [
      {
        name: "fileList",
        path: "/fileManage/fileList",
        component: "fileManage/fileList/index",
        meta: {
          icon: "el-icon-menu",
          title: "文件列表"
        }
      },
    ]
  },
  {
    name: "examManage",
    path: "/examManage",
    meta: {
      icon: "el-icon-eleme-filled",
      title: "任务管理"
    },
    children: [
      {
        name: "questionList",
        path: "/examManage/questionList",
        component: "examManage/questionManage/index",
        meta: {
          icon: "el-icon-menu",
          title: "题目列表"
        }
      },
      {
        name: "questionDetail",
        path: "/examManage/questionDetail",
        component: "examManage/questionManage/detail/index",
        meta: {
          icon: "el-icon-menu",
          title: "题目详情",
          fullpage: true,
          hidden: true
        }
      },
      {
        name: "examList",
        path: "/examManage/examManage",
        component: "examManage/examManage/index",
        meta: {
          icon: "el-icon-menu",
          title: "任务列表"
        }
      },
      {
        name: "examDetail",
        path: "/examManage/examDetail",
        component: "examManage/examManage/detail/index",
        meta: {
          icon: "el-icon-menu",
          title: "任务详情",
          fullpage: true,
          hidden: true
        }
      },
      {
        name: "examRecord",
        path: "/examManage/examRecord",
        component: "examManage/examManage/component/info.vue",
        meta: {
          icon: "el-icon-menu",
          title: "考试记录",
          fullpage: true,
          hidden: true
        }
      },
    ]
  },
]

export default routes;
