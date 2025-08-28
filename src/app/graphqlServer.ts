// src/app/graphqlServer.ts
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { healthResolvers } from "@features/health/interfaces/graphql/health.resolver";
import { helloResolvers } from "@features/hello/interfaces/graphql/hello.resolver";
import { tmsResolvers } from "@features/tmsSoap/interfaces/graphql/tmsSoap.resolver";

export async function setupGraphQL(app: express.Express) {
  const typeDefs = `
    type Health { status: String!, uptime: Float! }
    type Query {
      health: Health!
      hello(name: String): String!
      tmsStatus(id: String!): String
      tmsHistory(id: String!): String
    }
  `;

  const resolvers = {
    Query: {
      ...healthResolvers.Query,
      ...helloResolvers.Query,
      ...tmsResolvers.Query
    }
  };

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const server = new ApolloServer({ schema } as any);
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
}



import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { Express } from "express";
import { Container } from "tsyringe";

// Collect resolvers
import { healthResolver } from "../features/health/interfaces/graphql/health.resolver";
import { helloResolver } from "../features/hello/interfaces/graphql/hello.resolver";
import { tmsSoapResolver } from "../features/tmsSoap/interfaces/graphql/tmsSoap.resolver";

export function startGraphQLServer(container: Container) {
  const schema = buildSchema(`
    type Query {
      health: String
      hello(name: String): String
      shipmentStatus(id: String!): String
      shipmentHistory(id: String!): [String]
    }
  `);

  const root = {
    ...healthResolver(container),
    ...helloResolver(container),
    ...tmsSoapResolver(container),
  };

  const app = container.resolve<Express>("ExpressApp");
  app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));
}
