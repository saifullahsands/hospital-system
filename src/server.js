require("module-alias/register");
const { PORT}=require("@config/env.config")
const { logger } = require("@config/logger");
const { prisma } = require("@config/prisma");
const { connection_database } = require("@config/database");
const app = require("./app");
(async function () {
  try {
    await connection_database();
    app.listen(PORT, () => logger.info(`server is running at port :: ${PORT}`));
  } catch (error) {
    logger.error(`error in server connect with database ${error.message}`);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
