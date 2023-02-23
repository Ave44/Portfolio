import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/main/Layout.vue'
import TreeLayout from '../components/main/Tree/TreeLayout.vue'
import EditPerson from '../components/main/Tree/EditPerson.vue'
import AddPerson from '../components/main/Tree/AddPerson.vue'
import Social from '../components/main/Social/Social.vue'
import FriendView from '../components/main/Social/FriendView.vue'
import GroupView from '../components/main/Social/GroupView.vue'
import Search from '../components/main/Search/Search.vue'
import SearchMain from '../components/main/Search/SearchMain.vue'
import SearchByName from '../components/main/Search/SearchByName.vue'
import SearchBySurnames from '../components/main/Search/SearchBySurnames.vue'
import Login from '../components/Login.vue'
import SignUp from '../components/SignUp.vue'
import NotFound from '../components/NotFound.vue'
import NetworkError from '../components/NetworkError.vue'

const routes = [
    {
        path: '/profile',
        name: 'Layout',
        component: Layout,
        props: true,
        children: [
          {
            path: '/search',
            name: 'Search',
            component: Search,
            props: true,
            children: [
              {
                path: '',
                name: 'SearchMain',
                component: SearchMain
              },
              {
                path: 'byName',
                name: 'SearchByName',
                component: SearchByName
              },
              {
                path: 'bySurnames',
                name: 'SearchBySurnames',
                component: SearchBySurnames
              },
            ]
          },
          {
            path: '/tree',
            name: 'TreeLayout',
            component: TreeLayout
          },
          {
            path: '/tree/editperson',
            name: 'EditPerson',
            component: EditPerson
          },
          {
            path: '/tree/addperson',
            name: 'AddPerson',
            component: AddPerson
          },
          {
            path: '/social',
            name: 'Social',
            component: Social
          },
          {
            path: '/social/friend',
            name: 'FriendView',
            component: FriendView
          },
          {
            path: '/social/group',
            name: 'GroupView',
            component: GroupView
          },
          {
            path: '/',
            redirect: '/login'
          }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/signUp',
        name: 'SignUp',
        component: SignUp,
    },
    {
        path: '/404',
        name: 'NotFound',
        component: NotFound,
    },
    {
        path: '/network-error',
        name: 'NetworkError',
        component: NetworkError
    }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
