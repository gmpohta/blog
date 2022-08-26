<template>
<div style="margin-bottom:5%">
  <b-nav tabs>
    <router-link tag="b-nav-item" to="/" >Blog</router-link>
    <router-link tag="b-nav-item" to="/user-posts">My posts</router-link>
    
    <button class="btn btn-outline" @click="logout">Logout</button>
  </b-nav>
  <div style="text-align:right">
    <p style="color:black;">User: <span>{{ userName }}</span> </p>
  </div>
  
</div>
</template>

<script>
export default {
  name: 'Nav',
  components:{
  },
  methods:{
    logout(){
      this.$store.commit('auth/logout')
    }
  },
  computed:{
      userName(){
        return this.$store.getters['auth/userName']
      } 
  },
}
</script>
