import path from 'path'
import MediaModel from '../models/media.js'
import UserModel from '../models/user.js'
import PostModel from '../models/post.js'

class apiBlogControllers{
  
  async getPostsForDates(req, res){
    try{
      if (!req.body.dateStart || !req.body.numOfPosts) return res.sendStatus(400)
      const dateStart = req.body.dateStart
      const numOfPosts = Number(req.body.numOfPosts)

      if (numOfPosts > 200) numOfPosts=200

      let postAndUser = await PostModel.getPostForDates({dateStart,numOfPosts})

      let result=[]
      for(const post of postAndUser){
        const media=await MediaModel.findMediaForPost(post.id)
        result.push({...post, media })
      }

      return res.status(200).json(result)

    }catch(err){
       res.status(500).send(err.message)
    }
  }    
  
  async getUserPosts(req, res){
    try{
      const posts = await PostModel.getPostsByUserId(req.userId)
      const user =await UserModel.getUserById(req.userId)

      let result=[]
      for(const post of posts){
        const media=await MediaModel.findMediaForPost(post.id)
        result.push({...post, userName:user.name, media })
      }
        
      return res.status(200).json(result)

    }catch(err){
        res.status(500).send(err.message)
    }
  }    

  async getPostById(req, res){
    const { id } = req.params
    try{

      const post = await PostModel.getPostById(id)
      const user =await UserModel.getUserById(req.userId)
      if (req.userId!==post.userId) return res.sendStatus(403)
        
      const media = await MediaModel.findMediaForPost(post.id)
      return res.status(200).json({...post, userName:user.name, media})

    }catch(err){
        res.status(500).send(err.message)
    }
  }

  async getUserListMedia(req, res){
    try{

      const result = await MediaModel.getUserListMedia(req.userId)
      return res.status(200).json(result)

    }catch(err){
        res.status(500).send(err.message)
    }
  }

  async downloadMedia(req,res){
    try{
      const { id } = req.params
      const query=await MediaModel.getMediaById(id)
      res.download(path.resolve('./')+'/media/'+query.URL)
    }catch(err){
      res.status(500).send(err.message)
    }
  }

  async createPost(req, res){ 
  try{
      if (!req.body.text && !req.body.media.length) return res.status(400).send({meta:'Send file or post body',code:-1})
      await PostModel.createPost({ 
        title: req.body.title,
        text:req.body.text,
        userId:req.userId, 
        date:req.body.date,
        media:req.body.media
      })
      res.sendStatus(200)
    }catch(err){
      res.status(500).send(err.message)
    }
  }   

  async uploadMedia(req, res){
    if (!req.files) return res.status(400).json("No files")
    if (Object.keys(req.files).length>1) return res.status(400).json("Sended more that one file")
    try{
      await MediaModel.uploadMedia(req.files.file,req.userId)
      const result = await MediaModel.getUserListMedia(req.userId)

      res.status(200).json(result)

    }catch(err){
      res.status(500).send(err.message)
    }
  }   

  async deletePost(req, res){
    const { id } = req.params
    try{

      const post = await PostModel.getPostById(id)
      if (req.userId!==post.userId) return res.sendStatus(403)
      
      await PostModel.deletePostById(id)
      return res.sendStatus(200)
      
    }catch(err){
      res.status(500).send(err.message)
    }
  }

  async deleteMedia(req, res){ 
    const { id } = req.params
    try{
      let media=await MediaModel.getMediaById(id)
      if (req.userId!==media.userId) return res.sendStatus(403)

      await MediaModel.deleteMedia(id)

      const result = await MediaModel.getUserListMedia(req.userId) 
      res.status(200).json(result)

    }catch(err){
      res.status(500).send(err.message)
    }
  }

  async editPost(req, res){ 
    const { id } = req.params
    try{

      const post = await PostModel.getPostById(id)

      if (req.userId!==post.userId) return res.sendStatus(403)
      if (!req.body.text && !req.body.media.length) return res.status(400).send({meta:'Send file or post body',code:-1})
      await PostModel.updatePostById({
        post: { 
          date:req.body.date, 
          title: req.body.title,
          text:req.body.text,
          date:req.body.date,
          media:req.body.media
        },
        postId:id
      })
      res.sendStatus(200)
    }catch(err){
      res.status(500).send(err.message)
    }
  }

}

export default new apiBlogControllers()