const router = require("express").Router();
const User = require("../models/User");

//Register
router.get("/register", async (req,res) =>{
    const user = await new User({
        username:"John",
        email:"kingman@gmail.com",
        password:"78298918"
    })

    await user.save();
    res.send("nothing")
});

module.exports = router