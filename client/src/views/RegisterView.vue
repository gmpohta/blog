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
    <h2>Registration</h2>
    <form @submit.prevent="registerUser">
      <div class="form-outline mb-4">
        <input type="text" id="form3Example1cg" v-model="data.user" class="form-control form-control-lg" required/>
        <label class="form-label" for="form3Example1cg">Your Name</label>
      </div>
      <div class="form-outline mb-4">
        <input type="password" id="form3Example4cg" v-model="data.password" class="form-control form-control-lg" required/>
        <label class="form-label" for="form3Example4cg">Password</label>
      </div>
      <div class="form-outline mb-4">
        <input type="password" id="form3Example4cdg" v-model="repeatPassword" class="form-control form-control-lg" required/>
        <label class="form-label" for="form3Example4cdg">Repeat your password</label>
        <p v-if="msgSucceed.length" style="color:green; text-align:center">{{ msgSucceed }}</p>
        <p v-else style="color:red; text-align:center">{{ msgError }}</p>
      </div>
      <div class="d-flex justify-content-center">
        <button type="submit" class="btn btn-primary btn-block  mb-4">Register</button>
      </div>
      <div class="text-center">
        <p>Have already an account? <router-link to="login">Login here</router-link></p>
      </div>
    </form>

  </div>
</div>
</template>

<script>
export default {
  methods:{
    async registerUser(){
      if (this.data.password===this.repeatPassword){
        this.loadingStatus=true
        await this.$store.dispatch('auth/register',this.data)
        .then(()=>{
          this.msgSucceed='You are registered'
          setTimeout(()=>this.$router.push('login'),1500)
        })
        .catch(err=>{
          this.msgError=''
          if (err.response.data.code==="P2002"){
            this.msgError="User already exist"
          }else{
            this.msgError='Failed to register'
          } 
          console.log(err.response)
        })
        this.data.password=''
        this.repeatPassword=''
        this.data.user=''
        this.loadingStatus=false
      } else this.msgError='Password does not match repeated password'
    }
      
  },
  data(){
    return{
      msgError:'',
      msgSucceed:'',
      loadingStatus:false,
      repeatPassword:'',
      data:{
        user:'',
        password:'',
      }

    }
  },
  mounted(){
  }
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