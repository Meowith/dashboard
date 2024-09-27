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
import {type App, fromOwnedApps, userRoleFrom} from "@/models/entity";
import {useStateStore} from "@/stores/state";
import {listOwnedApps} from "@/service/app-management";
import NotFoundView from "@/views/NotFoundView.vue";
import {getRoles} from "@/service/role-management";
import AdminUserView from "@/components/admin/AdminUserView.vue";

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
                },
                {
                    path: "users",
                    name: "admUserMgmt",
                    component: AdminUserView
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
        },
        {
            path: '/404',
            name: '404',
            component: NotFoundView
        }
    ]
})

router.beforeEach(async (to, from, next: NavigationGuardNext) => {
    let {preferences} = usePreferenceStore()
    if (!preferences.token && to.redirectedFrom == undefined && to.name != "login" && to.name != "setup") {
        return next("/login")
    }

    try {
        if (['appMgmt', 'appUserMgmt', 'appRoleMgmt', 'appTokenMgmt'].includes(to.name as string)) {
            const state = useStateStore()
            let id = to.params['id']
            let app: App | undefined = state.ownApps?.apps.find(x => x.id == id)
            if (!app) {
                state.setApps(fromOwnedApps(await listOwnedApps()))
                app = state.ownApps?.apps.find(x => x.id == id)
            }
            if (!app) return next("/404")
            if (state.currentApp?.id != app.id) {
                state.setCurrentApp(app)
                state.setCurrentRoles((await getRoles(app.id)).roles.map(userRoleFrom))
            }
        }
    } catch(e) {
        return next("/404")
    }

    next();
})


export default router
