const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

const { typeDefs, resolvers } = require("./schemas");

const db = require("./config/connection");
const app = express();
const PORT = process.env.PORT || 3001;
const path = require("path");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use("/graphql", expressMiddleware(server));

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(_dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(_dirname, "../client/dist/index.html"));
    });
  }

  db.once("open", () => {
    app.listen(PORT, () =>
      console.log(`Server live at http://localhost:${PORT}/graphql`)
    );
  });
};

startApolloServer();