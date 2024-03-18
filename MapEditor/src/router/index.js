import { createRouter, createWebHistory ,createWebHashHistory} from 'vue-router'

import MapCheck from '../views/MapCheck/index.vue'
import HomeView from '../views/HomeView.vue'
import MapEditor from '../views/MapEditor/index.vue'
// import DataScreen from '../views/DataScreen/index.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    redirect: '/mapeditor',

    children:[
      {
        path: 'mapcheck',
        name: 'mapcheck',
        label:'地图预览',
        component:MapCheck
      },
      {
        path: 'mapeditor',
        name: 'mapeditor',
        label:'地图编辑',
        component: MapEditor
      },
    ]
  },

]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
