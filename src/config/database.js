const { prisma } = require("@config/prisma");

const connection_database = async () => {
  try {
    await prisma.$connect();
    console.log(`database connected successfully`);
  } catch (error) {
    console.log(`error in connection database ${error.message}`);
    const err = responses.server_error_response(error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

module.exports={connection_database}