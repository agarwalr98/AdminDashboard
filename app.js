const express = require('express')
const bodyParser = require('body-parser')
const {adminRouter} = require('./admin');
const app = express()
app.use(bodyParser.json())


//Always keep adminBro router to top because it may not handle middlewares
app.use('/admin', adminRouter)

app.use("/", (req, res, next)=>{
    console.log(req.query);
    next();
})
app.get('/', (req, res) => {
  res.send('Hello World')
})


//...
// Your Routes
//...

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`)
})