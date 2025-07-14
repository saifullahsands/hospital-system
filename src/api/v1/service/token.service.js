const jwt = require("jsonwebtoken");

class TokenService {
  constructor(secret_key) {
    this.secret_key = secret_key;
  }

  generate_access_token = async ({ id, role_type }) => {
    return jwt.sign({ id: id, role: role_type }, this.secret_key, {
      expiresIn: "7d",
    });
  };
  verify_access_token = async ( accessToken ) => {
    try {
      const { id, role } = await jwt.verify(accessToken, this.secret_key);
      return { id, role };
    } catch (error) {
      return null;
    }
  };
}


module.exports=TokenService;