const cron = require("node-cron");
const { prisma } = require("@config/prisma");

cron.schedule(
  "51 20 * * *", // Runs daily at 8:45 PM
  async () => {
    const now = new Date();

    // Local timezone for logs
    console.log(
      `🕒 Cron started at: ${now.toLocaleString("en-PK", {
        timeZone: "Asia/Karachi",
      })}`
    );

    // Yesterday's range in local time
    const yesterdayStart = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);

    const yesterdayEnd = new Date();
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);

    try {
      const deleted = await prisma.appointment.deleteMany({
        where: {
          created_at: {
            gte: yesterdayStart,
            lte: yesterdayEnd,
          },
        },
      });

      console.log(
        `🗑️ Deleted ${
          deleted.count
        } appointments created on ${yesterdayStart.toDateString()}`
      );
    } catch (error) {
      console.error("❌ Cron job failed:", error.message);
    }
  },
  {
    timezone: "Asia/Karachi", // 🔥 Ensure it runs at local 8:45 PM
  }
);
