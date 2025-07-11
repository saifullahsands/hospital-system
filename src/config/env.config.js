const path=require("path")
require("dotenv").config({
    path:path.resolve(__dirname,"../../.env")
})


module.exports={
    PORT:process.env.PORT,
    SECRET_TOKEN_KEY:process.env.SECRET_TOKEN_KEY,
    TOKEN_EXPIRY:process.env.TOKEN_EXPIRY
}