import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import authRoutes from './routes/authRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import jwtTokenValidate from './scripts/validate.js'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(fileUpload())
app.use(express.json())

app.use((req, res, next) => {
  const path = req.path.split('/')
  if (path[1]==='login' || path[1]==='register' ) {
    return next()
  }
  return jwtTokenValidate(req, res, next)
})

app.use(authRoutes)
app.use(blogRoutes)

app.use((req, res, next) => {
  res.status(404).json(`Not found for path: ${req.path}`)
})

app.listen(port, () => {
  console.log(`Listening to requests on port ${port}`)
})

