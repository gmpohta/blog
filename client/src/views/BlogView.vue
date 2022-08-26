<template>
<div>
  <Nav/>
  <div v-if="loadingStatus">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
  </div>
  <div v-else>
    <h2 style="margin-bottom:5%">Blog</h2>
    <hr>
    <button class="btn btn-primary" @click="createPost">Create post</button>
    
    <div  ref="posts">
      <div v-if="postList.length">
        <div  v-for="item of postList" :key="item.id">
          <Post :post="item" style="margin-bottom:0.5%" :key="item.id"/>
        </div>
      </div>
      <div v-else style="margin-top:5%">
        <p>No posts yet</p>
      </div>
    </div>

    <hr v-if="postList.length">
    <button v-if="postList.length" class="btn btn-primary" @click="downloadMore" :disabled="loadingStatus">
      <span v-if="!loadingStatus">Load more...</span>
      <div v-else class="spinner-border" role="status">
      <span class="sr-only"></span>
      </div> 
    </button>
  </div>
</div>
</template>

<script>

import Nav from "@/components/Nav.vue"
import Post from "@/components/Post.vue"
import { mapState } from 'vuex'

export default {
  components:{
    Nav,
    Post
  },
  computed:mapState({
      postList: state => state.blog.postList,
  }),
  methods:{
    createPost(){
      this.$router.push('/create')
    },
    async downloadMore(){
      let initialHeight = this.$refs.posts.scrollHeight
      
      this.request.dateStart=new Date()
      if (this.postList.length) {
        this.request.dateStart=new Date(this.postList[this.postList.length-1].date)
      }

      this.loadingStatus=true
      await this.$store.dispatch('blog/postsForDates',this.request)
      .then(res=>{
        this.$store.commit('blog/addToEndPostList',res.data)
      })
      this.$nextTick(() => {
        this.$refs.posts.scrollTop = this.$refs.posts.scrollHeight - initialHeight
      })
      this.loadingStatus=false
    },
  },
  data(){
    return{
      loadingStatus:false,
      request:{
        dateStart:new Date(),
        numOfPosts:20
      }
    }
  },
  async mounted(){
    this.request.dateStart=new Date()
    this.loadingStatus=true
    await this.$store.dispatch('blog/postsForDates',this.request)
    .then(res=>{
      this.$store.commit('blog/postList',res.data)
    })
    this.loadingStatus=false
  }
}
</script>
