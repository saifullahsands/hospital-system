const cron = require("node-cron");
const { prisma } = require("@config/prisma");

cron.schedule("* * * * *", async () => {
  const now = new Date();

  const startHour =3;
  const endHour = 20;
  const isAvailablility = now.getHours() >= startHour && now.getHours() < endHour;

  try {
    await prisma.users.updateMany({
      where: {
        role: "DOCTOR",
      },
      data: {
        is_available: isAvailablility,
      },
    });
    console.log(
      `All doctors set to ${
        isAvailablility ? "✅ AVAILABLE" : "❌ UNAVAILABLE"
      } at ${now.toLocaleTimeString()}`
    );
  } catch (error) {
    return false;
  }
});

