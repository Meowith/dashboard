import {createRouter, createWebHistory, type NavigationGuardNext} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";
import SetupView from "@/views/SetupView.vue";
import AppsHome from "@/components/apps/AppsHome.vue";
import AdminView from "@/views/AdminView.vue";
import NodeView from "@/components/admin/NodeView.vue";
import {usePreferenceStore} from "@/stores/preferences";
import AppManager from "@/components/apps/AppManager.vue";
import UserManagement from "@/components/users/MemberManagement.vue";
import TokenManagement from "@/components/tokens/TokenManagement.vue";
import RoleManagement from "@/components/roles/RoleManagement.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            children: [
                {
                    path: '',
                    name: 'appList',
                    component: AppsHome,
                },
                {
                    path: 'apps/:id',
                    name: 'appMgmt',
                    component: AppManager,
                },
                {
                    path: 'apps/:id/users',
                    name: 'appUserMgmt',
                    component: UserManagement,
                },
                {
                    path: 'apps/:id/roles',
                    name: 'appRoleMgmt',
                    component: RoleManagement,
                },
                {
                    path: 'apps/:id/tokens',
                    name: 'appTokenMgmt',
                    component: TokenManagement,
                }
            ]
        },
        {
            path: '/admin',
            name: 'admin',
            component: AdminView,
            children: [
                {
                    path: '',
                    name: 'nodeView',
                    component: NodeView,
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/setup',
            name: 'setup',
            component: SetupView
        }
    ]
})

router.beforeEach(async (to, from, next: NavigationGuardNext) => {
    let {preferences} = usePreferenceStore()
    if (!preferences.token && to.redirectedFrom == undefined && to.name != "login") {
        return next("/login")
    }
    next();
})


export default router
