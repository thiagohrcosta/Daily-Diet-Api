import fastify from 'fastify';

const app = fastify();

app.get("/", () => {
  return { hello: "world" };
});

app.listen({
  port: 3333,
}).then(() => {
  console.log("Server started at http://localhost:3333");
});