import axios from "axios"
import { authHeader } from "@/scripts/authHeader"
import { API_URL } from "@/scripts/configAPI.js"

export default {
    namespaced: true,
    state: {
        postList:[],
        userMedia:[],
        post:null,
        mediaFiles:[],
        downloadedMediaId:[],
        uploadMediaController: null,
    },
    getters:{
        fileById(state){
            return (mediaId) => {
                return mediaId.map(el=>{
                    let ind = state.mediaFiles.findIndex(file => file.id === el)
                    if ( ind < 0)
                        return{
                            id:el,
                            file:null,
                            type:null,
                        }
                    else
                        return state.mediaFiles[ind]
                })
            }
        },
    },
    mutations: {
        addToEndPostList(state,data){
            state.postList.push(...data)
        },
        postList(state,data){
            state.postList=data
        },
        postList(state,data){
            state.postList=data
        },
        userMedia(state,data){
            state.userMedia=data
        },
        post(state,data){
            state.post=data
        },
        downloadMedia(state,{id,data,type}){
            const URL = window.URL || window.webkitURL
            state.mediaFiles.push({id, file:URL.createObjectURL(data), type})
        },
        cancelUploadMedia(state){
            if (state.uploadMediaController)
                state.uploadMediaController.abort()
        }
    },
    actions: {
        downloadMediaList({dispatch},listMedia ){
            let promises=[]
            for (let item of listMedia){ 
                promises.push(
                    dispatch('downloadMedia',{mediaId:item.id, type:item.type})
                )
            }
            return Promise.all(promises)
        },
        downloadMedia({state,commit},{mediaId,type}){
            if (state.downloadedMediaId.indexOf(mediaId)<0){
                state.downloadedMediaId.push(mediaId)
                return axios({
                    method:'get',
                    url: API_URL + '/download-media/'+mediaId,
                    headers: {...authHeader()},
                    responseType: 'blob',
                })
                .then(result=>{
                    commit('downloadMedia',{id:mediaId,data:result.data,type})
                })
                .catch(err=>{
                    console.log(err.response)
                    let ind = state.downloadedMediaId.findIndex(el=>el===mediaId)
                    state.downloadedMediaId.splice(ind,1)
                })
            }
        },

        uploadMedia({commit,state},files){
            let formData = new FormData()
            formData.append('file', files[0])
            state.uploadMediaController=new AbortController()

            return axios({
                method:'post',
                url: API_URL + '/upload-media',
                headers: {'Content-Type': 'multipart/form-data', ...authHeader()},
                data: formData,
            })
            .then(res=>{
                commit('userMedia',res.data)
            })
            .catch(err=>{
                if(err.code=='ERR_CANCELED'){
                    console.log(err)
                }else{
                    throw err
                }

            })
        },
       
        editPost(context,{postId,editedPost}){
            return axios({
                method:'put',
                url: API_URL + '/edit-post/'+postId,
                headers: {'Content-Type':'application/json', ...authHeader()},
                data:editedPost
            })
        },

        postById({commit},postId){
            return axios({
                method:'get',
                url: API_URL + '/get-post/'+postId,
                headers: {'Content-Type':'application/json', ...authHeader()},
            })
            .then(res=>{
                commit('post',res.data)
            })
        },
        userMedia({commit}){
            return axios({
                method:'get',
                url: API_URL + '/get-user-list-media',
                headers: authHeader()
            })
            .then(res=>{
                commit('userMedia',res.data)
            })
        },

        deleteMedia({commit},mediaId){
            return axios({
                method:'delete',
                url: API_URL + '/del-media/'+mediaId,
                headers: {'Content-Type':'application/json', ...authHeader()},
            })
            .then(res=>{
                commit('userMedia',res.data)
            })
        },
        userPosts({commit}){
            return axios({
                method:'get',
                url: API_URL + '/get-user-posts',
                headers: {'Content-Type':'application/json', ...authHeader()},
            })
            .then(res=>{
                commit('postList',res.data)
            })
        },
        
        deletePost({commit},postId){
            return axios({
                method:'delete',
                url: API_URL + '/del-post/'+postId,
                headers: {'Content-Type':'application/json', ...authHeader()},
              })
        },
        createPost({commit},{ title, text, media }){
            return axios({
                method:'post',
                url: API_URL + '/create-post',
                headers: {'Content-Type':'application/json', ...authHeader()},
                data:{ title, text, media }
            })
        },

        postsForDates({commit},{dateStart,numOfPosts}){
            return axios({
                method:'post',
                url: API_URL + '/get-posts-for-dates',
                headers: {'Content-Type':'application/json', ...authHeader()},
                data:{
                    dateStart,
                    numOfPosts
                }
            })
            .catch(err=>{
                console.log(err.res)
            })
        }
    }
}