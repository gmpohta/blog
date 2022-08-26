import express from 'express'
import apiBlogControllers from '../controllers/apiBlogControllers.js'

const blogRoutes = express.Router()

blogRoutes.get('/download-media/:id', apiBlogControllers.downloadMedia) 
blogRoutes.get('/get-user-posts', apiBlogControllers.getUserPosts) 
blogRoutes.get('/get-post/:id', apiBlogControllers.getPostById) 
blogRoutes.get('/get-user-list-media',apiBlogControllers.getUserListMedia) 

blogRoutes.post('/get-posts-for-dates', apiBlogControllers.getPostsForDates) 
blogRoutes.post('/create-post', apiBlogControllers.createPost)
blogRoutes.post('/upload-media', apiBlogControllers.uploadMedia)

blogRoutes.delete('/del-post/:id', apiBlogControllers.deletePost)
blogRoutes.delete('/del-media/:id', apiBlogControllers.deleteMedia)

blogRoutes.put('/edit-post/:id', apiBlogControllers.editPost)

export default blogRoutes

