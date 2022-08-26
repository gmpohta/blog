import { PrismaClient,Prisma } from '@prisma/client'


const prisma = new PrismaClient()


class PostModel{
  async getPostForDates({dateStart,numOfPosts}){
    return prisma.$queryRaw
      `SELECT "Post".*, "User"."name" as "userName"
      FROM "Post" INNER JOIN
      "User" ON  "Post"."userId" = "User"."id"
      WHERE "Post"."date" < ${new Date(dateStart)} 
      ORDER BY "Post"."date" DESC
      LIMIT ${Number(numOfPosts)}`
  }
  async getPostsByUserId(userId){
    return prisma.post.findMany({
      where: {
        userId:Number(userId), 
      },
      orderBy: {
        date: 'desc' 
      },
    })
  }
  async getPostById(postId){
    return prisma.post.findFirst({
      where: { id: Number(postId)},
    })
  }
  
  async createPost(post){
    const newPost = await prisma.post.create({
      data: { 
        title: post.title,
        text:post.text,
        userId:post.userId, 
        date:post.date
      }
    })
    
    const promises=[]
    for (let mediaId of post.media){ 
      promises.push(
        prisma.mediaOnPost.create({
          data: { mediaId:mediaId, postId:newPost.id },
        })
      )
    }

    Promise.all(promises)
    
  }
  async deletePostById(postId){
    return prisma.post.delete({
      where: { id: Number(postId)},
    })
  }

  async updatePostById({post,postId}){
    postId=Number(postId)
    await prisma.post.update({
      data: { 
        date:post.date, 
        title: post.title,
        text:post.text,
        date:post.date
      },
      where:{
        id:postId
      }
    })

    await prisma.$queryRaw
    `DELETE FROM "MediaOnPost"  
    WHERE "MediaOnPost"."id" IN 
    (SELECT "MediaOnPost"."id" 
    FROM "MediaOnPost"
    WHERE "MediaOnPost"."postId"=${postId})`

    let promises=[]
    for (let mediaId of post.media){ 
      promises.push(
        prisma.mediaOnPost.create({
          data: { mediaId:mediaId,postId:postId },
        })
      )
    }

    Promise.all(promises)
  }
}

export default new PostModel()