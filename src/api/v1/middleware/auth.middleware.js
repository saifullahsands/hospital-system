const { SECRET_TOKEN_KEY } = require("@config/env.config");
const TokenService = require("@v1_service/token.service");
const token_service = new TokenService(SECRET_TOKEN_KEY);
const { prisma } = require("@config/prisma");
const Responses = require("@constants/responses");
const responses = new Responses();
class AuthMiddleware {
  authenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (
      !authHeader ||
      typeof authHeader === "string" ||
      !authHeader.startsWith("Bearer ")
    ) {
      const response = responses.unauthorized_error(
        "unAuthorized ,cookie not found"
      );
      return res.status(response.status.code).json(response);
    }
    const token = authHeader.split(" ")[1];
    const id = await token_service.verify_access_token({ accessToken: token })
      ?.id;
    if (!id) {
      const response = responses.session_expired_response(
        "Access token is expired"
      );
      return res.status(response.status.code).json(response);
    }

    const user = await prisma.users.findUnique({
      where: { id: `${id}` },
    });
    if (!user) {
      const response = responses.unauthorized_error("User not found");
      return res.status(response.status.code).json(response);
    }
    req.user = { user };
    req.user.id = user.id;
    next();
  };

  verify_role = async (Role) => {
    return (req, res, next) => {
      if (req.user.role !== Role) {
        const response = responses.unauthorized_error(
          `this route can only ${Role} access`
        );
        return res.status(response.status.code).json(response);
      }
      next();
    };
  };
}

module.exports = AuthMiddleware;
