import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import MediaModel  from '../models/media.js'
import UserModel from '../models/user.js'


class apiAuthControllers{
  async loginUser(req,res){ 
    let user={}     
    try{ 
      if (!req.body.userName || !req.body.password) return res.status(401).send({meta:'User data not sent',code:-1})
      user = await UserModel.getUserByName(req.body.userName) 
      if (!user) return res.status(400).send({meta:'User does not exist',code:-1})
      bcrypt.compare(req.body.password, user.password, (err, resultCompare) => {
        if (err) return res.sendStatus(500)
        if (!resultCompare) return res.sendStatus(401)
  
        const token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + (3600*24),
          userId: user.id
        }, process.env.SECRET_KEY)
        return res.status(200).json({token, userId:user.id, userName:user.name})
      })

    }catch(err){
      return res.status(500).send(err.message)
    }
  }

  async registerUser(req,res){
    if (!req.body.user || !req.body.password) return res.status(401).send({meta:'User data not sent',code:-1})
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(500).send(err.message)
      bcrypt.hash(req.body.password, salt, async (err, hash) => {
        if (err) return res.status(500).send(err.message)
        try{
          await UserModel.createUser({name:req.body.user,hash})
          res.sendStatus(200)

        }catch(err){
          return res.status(500).send(err.message)
        }
      })
    })
  }

  async deleteUser(req,res){
    const { id } = req.params
    if (req.userId!==Number(id)) return res.sendStatus(403)
    try{
      let media = await MediaModel.getUserListMedia(req.userId)
      let promises=[]
      
      for (let el of media){ 
        promises.push(
          MediaModel.deleteMedia(el.id)
        )
      }

      await Promise.all(promises)
      UserModel.deleteUser(id)
      res.sendStatus(200)
      
    }catch(err){
      res.status(500).send(err.message)
    }
  }

}

export default new apiAuthControllers()