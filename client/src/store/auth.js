import axios from "axios"
import { router } from "@/router/index.js"
import { API_URL } from "@/scripts/configAPI.js"
import { authHeader } from "@/scripts/authHeader"

export default {
    namespaced: true,
    state: {
      user:JSON.parse(localStorage.getItem('user')||'null'),
    },
    getters:{
        userName(state){
            if (state.user){
                return state.user.userName
            }else{
                return null
            }
            
        }
    },
    mutations: {
        login(state,data){
            state.user=data
            localStorage.setItem('user',JSON.stringify(state.user))
        },
        logout(state){
            localStorage.removeItem('user')
            state.user=null
            router.push({name:'login'})
        },
    },
    actions: {
        deleteUser({commit},userId){
            return axios({
                method:'delete',
                url: API_URL + '/del-user/'+userId,
                headers: {'Content-Type':'application/json', ...authHeader()},
            })
            .then(res=>{
                commit('logout')
            })
        },
        register(contex,data){
            return axios({
                method:'post',
                url: API_URL + '/register',
                headers: {'Content-Type':'application/json'},
                data: data
            })
        },
        login({commit},{userName,password}){
            return axios({
                method:'post',
                url: API_URL + '/login',
                headers: {'Content-Type':'application/json'},
                data:{
                    userName,
                    password
                }
            })
            .then(res=>{
                commit('login',res.data)
                router.push({name: 'blog'})
            })
        }
    }
  }