require("dotenv").config()

const { SECRET, CONNECTION_STRING } = process.env
const express = require("express")
const session = require("express-session")
const app = express()
const port = process.env.PORT || 3001
const { json } = require("body-parser")

app.use(json())

app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 10000000000
    }
  })
)

console.log("process.env", process.env)

app.listen(port, () => console.log(`Server is listening on port ${port}`))
