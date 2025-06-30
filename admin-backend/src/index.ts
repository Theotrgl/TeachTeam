import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { expressMiddleware } from "@apollo/server/express4";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 3002;

const JWT_SECRET = "default_secret";

// CORS
app.use(
  cors({
    origin: ["http://localhost:3003", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  // 🔐 Add auth context middleware
  app.use(
    "/graphql",
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || "";
        let user = null;

        if (authHeader.startsWith("Bearer ")) {
          const token = authHeader.replace("Bearer ", "");
          try {
            user = jwt.verify(token, JWT_SECRET);
          } catch (err) {
            console.warn("Invalid or expired token");
          }
        }

        return { user }; // available in all resolvers as context.user
      },
    })
  );

  await AppDataSource.initialize();
  console.log("Data Source has been initialized!");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((error) =>
  console.log("Error during server initialization:", error)
);
