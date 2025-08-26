export const helloResolvers = {
  Query: {
    hello: (_: any, args: { name?: string }) => `Hello ${args.name ?? "World"}`
  }
};
