import { PrismaClient,Prisma } from '@prisma/client'
import  path from 'path'
import fs from 'fs'

const prisma = new PrismaClient()


class MediaModel{
  async findMediaForPost(postId){
    return prisma.$queryRaw
      `SELECT "Media"."id", "Media"."URL", "Media"."type", "Media"."name"
      FROM "Media" INNER JOIN
      "MediaOnPost" ON "Media".id = "MediaOnPost"."mediaId"
      WHERE "MediaOnPost"."postId" = ${Number(postId)} `
  }

  async getMediaById(mediaId){
    return prisma.media.findFirst({
      where: { id: Number(mediaId)},
    })
  }

  async getUserListMedia(userId){
    return prisma.media.findMany({
      where: {
        userId:Number(userId), 
      },
    })
  }

  async uploadMedia(media,userId){
    const imageExt=['.png','.jpg','.jpeg','.bmp','.gif']
    const videoExt=['.avi', '.mpeg', '.wmv', '.mp4','.mov','.3g2','.3gp','.asf','.asx','.flv','.mkv','.rm']

    let URL=''
    let targetPath=''

    const ext=path.extname(media.name).toLowerCase()
    
    let type=''
    if (media.size >= 20*10e6) throw "File size more than 20 Mb"
    if (videoExt.map(el=>el===ext).findIndex(el=>el===true)!==-1){
      type='video'
    }else if(imageExt.map(el=>el===ext).findIndex(el=>el===true)!==-1){
      type='image'
    }else{
      throw "File have wrong extension"
    }
    
    URL = String(Date.now())+String(userId)+ext
    targetPath = path.resolve('./')+'/media/'+URL
    try{
      await media.mv(targetPath)
    }catch(err){
      throw "Failed to upload file"
    }
    
    await prisma.media.create({
      data: { URL:URL, userId:userId, type:type, name:media.name }
    })
    .catch(err=>{
      fs.unlinkSync(targetPath)
      throw "Failed to upload file"
    })
  }   

  async deleteMedia(mediaId){ 

    let media=await prisma.media.findFirst({
        where: { id: Number(mediaId)},
    })

    return await prisma.media.delete({
        where: { id: Number(mediaId)},
    })
    .then(()=>{
      const mediaPath = path.resolve('./')+'/media/'+media.URL
      if (fs.existsSync(mediaPath)) {
        fs.unlinkSync(mediaPath, async err=> {
          if (err) {
            await prisma.media.create({ data:media })
            throw "Failed to delete file"
          }
        })
      }
    })

  }

}

export default new MediaModel()