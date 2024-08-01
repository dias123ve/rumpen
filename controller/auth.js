const User = require('../model/model-user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require("dotenv")
dotenv.config()

module.exports = {
    login: async(req, res, next) =>{
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if(!user) return res.status(404).json({message:`Tidak ada username ${username}`})

            const validPw = await bcrypt.compare(
                password,
                user.password
            )
            if(!validPw) return res.status(401).json({message:"Password Salah"});
            const token = jwt.sign( {username: user.username, role: "admin"}, process.env.SECRET_KEY )
            return res.status(200).json({message:"Berhasil Login", token})
        } catch (error) {
            
        }
    }
}