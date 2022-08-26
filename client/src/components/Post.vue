<template>
<div style="padding:5%; margin:5%; border: 2px solid rgba(0, 0, 50, 0.2); border-radius:8px; background:rgb(230, 230, 220)">
  <h1>{{ post.title }}</h1>
  <p style="font-size:25px">{{ post.text }}</p>
  <div v-for="mediaEl of mediaFiles">
    <div v-if="!mediaEl.file">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else>
      <img v-if="mediaEl.type==='image'" :src="mediaEl.file" ref="img" :key="mediaEl.id" />
      <video ref="video"
          v-else-if="mediaEl.type==='video'"
          width="100%"
          :src="mediaEl.file"
          :key="mediaEl.id"
          controls
      />
    </div>
  </div>
  <p style="font-size:20px; text-align:right; margin:0; padding-top:5%;">{{ (new Date(post.date)).toLocaleDateString() }}</p>
  <p style="font-size:20px; text-align:right; margin:0; padding:0;">{{ post.userName }}</p>
</div>
</template>

<script>
export default {
  name: 'Post',
  computed:{
    mediaFiles(){
      return this.$store.getters['blog/fileById'](this.post.media.map(el=>el.id))
    }
  },
  props:[
    'post'
  ],
  methods:{

  },
  async mounted(){
    this.$store.dispatch('blog/downloadMediaList',this.post.media.map(el => {return {id:el.id, type:el.type}}))
  }
}
</script>
<style scoped>
img {
    max-width: 100%;
    max-height: 100%;
}
</style>
