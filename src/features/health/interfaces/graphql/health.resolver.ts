export const healthResolvers = {
  Query: {
    health: () => ({ status: "ok", uptime: process.uptime() })
  }
};
