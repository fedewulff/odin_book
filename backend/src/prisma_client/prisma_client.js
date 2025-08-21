const { PrismaClient } = require("../../generated/prisma")

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
})

module.exports = prisma
