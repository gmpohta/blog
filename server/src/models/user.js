import { PrismaClient,Prisma } from '@prisma/client'


const prisma = new PrismaClient()


class UserModel{
  async getUserById(userId){
    return prisma.user.findFirst({
      where: { id: Number(userId)},
    })
  }
  async getUserByName(userName){
    return prisma.user.findFirst({
      where: { name: userName}
    })
  }
  async createUser({name, hash}){
    await prisma.user.create({
      data: { 
        name: name,
        password: hash
      }
    })
  }   
  async deleteUser(userId){
    await prisma.user.delete({
      where: { id: Number(userId)}
    })
  }  
}

export default new UserModel()