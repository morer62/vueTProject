const express = require("express")
const path    = require("path")

const app  = express()
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, "app")))

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "app", "home.html"))
})

app.listen(port, () => {
  console.log(`serving app in port: http://localhost:${port}/`)
})