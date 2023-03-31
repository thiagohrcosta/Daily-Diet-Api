import fastify from 'fastify';
import { randomUUID } from 'node:crypto'

const app = fastify();

interface UserProps {
  id: string;
  name: string;
  email: string;
}

const listOfUsers: UserProps[] = [];

app.get("/", () => {
  return { hello: "world" };
});

app.get("/users", () => {
  return listOfUsers;
});

app.post("/users", (req , reply) => {
  const { name, email } = req.body as UserProps;

  const userAlreadyExists = listOfUsers.some((user) => user.email === email);

  if (userAlreadyExists) {
    return reply.status(400).send(
      {
        error: "User already exists!",
      }
    );
  }

  if (name && email) {
    const user = {
      id: randomUUID(),
      name,
      email,
    };

    listOfUsers.push(user);
  }

  return reply.status(201).send();
});

app.listen({
  port: 3333,
}).then(() => {
  console.log("Server started at http://localhost:3333");
});