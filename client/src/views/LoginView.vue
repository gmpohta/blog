<template>
<div>
  <div v-if="loadingStatus" style="text-align:center;">
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <div  v-else class="card"
    style="border: 1px solid rgba(0, 0, 0, 0.2); border-radius:8px; text-align:left"
  >
    <h2>Login</h2>
    <form @submit.prevent="login">
      <!-- Email input -->
      <div class="form-outline mb-4">
        <input id="email" ref="email" v-model="data.userName" class="form-control" required/>
        <label class="form-label" for="form2Example1">Name</label>
      </div>

      <!-- Password input -->
      <div class="form-outline mb-4">
        <input type="password" id="form2Example2" v-model="data.password" class="form-control" required/>
        <label class="form-label" for="form2Example2">Password</label>
        <p style="color:red; text-align:center">{{msg}}</p>
      </div>
      
      <!-- Submit button -->
      <button type="sybmit" class="btn btn-primary btn-block mb-4">Sign in</button>

      <!-- Register buttons -->
      <div class="text-center">
        <p>Not a member? <router-link to="register">Register</router-link></p>
      </div>
    </form>
  </div>
</div>
</template>

<script>
export default {
  methods:{
    async login(){
      this.loadingStatus=true
      this.msg=''
      await this.$store.dispatch('auth/login',this.data)
      .catch(err=>{
        console.log(err.response)
        this.data.password=''
        this.data.userName=''
        if (err.response.status===400){
          this.msg=err.response.data.meta
        }else if (err.response.status===401){
          this.msg='Wrong password'
        }else{
          this.msg='Server error'
        }
      })

      this.loadingStatus=false
    }
  },

  data(){
    return{
      loadingStatus:false,
      msg:'',
      data:{
        password:'',
        userName:'',
      }
    }
  },
}
</script>

<style>

.card{
    background: #fff;
    padding: 2%;
    margin-bottom:5%;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius:8px;
}
</style>