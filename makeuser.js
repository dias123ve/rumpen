require('./database')
const User = require("./model/model-user")
const bcrypt = require("bcrypt")

bcrypt.hash("kXDpEQAfU02JcIs", 10).then(pass =>{
    User.create({
        username: "admin123",
        password: pass,
        role: "admin"
    }).then(()=> console.log("berhasil membuat user"))
})