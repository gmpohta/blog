import express from 'express'
import apiAuthControllers from '../controllers/apiAuthControllers.js'

const authRoutes = express.Router()

authRoutes.post('/login', apiAuthControllers.loginUser)
authRoutes.delete('/del-user/:id', apiAuthControllers.deleteUser)
authRoutes.post('/register', apiAuthControllers.registerUser)

export default authRoutes 

