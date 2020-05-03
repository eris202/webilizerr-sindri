// This needs to be the first line
import 'reflect-metadata'

import express from 'express'
import AppLoader from './loaders/loader'

const app = express()
const port = process.env.PORT || 5555

const initAllLoaders = async () => {
  await AppLoader.init(app)
}

initAllLoaders().then(() => {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`)
  });
}).catch(er => {
  console.log(er)
})
