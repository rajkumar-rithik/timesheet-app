import Vue from 'vue'
import Router from 'vue-router'
import Project from './views/Project.vue'
import ProjectLog from './views/ProjectLog.vue'
import Timesheet from './views/Timesheet.vue'

Vue.use(Router)

export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'timesheet',
            component: Timesheet,
        },
        {
            path: '/project',
            name: 'project',
            component: Project,
        },
        {
            path: '/log',
            name: 'log',
            component: ProjectLog,
        },
    ],
})