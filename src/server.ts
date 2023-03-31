import fastify from 'fastify';
import { randomUUID } from 'node:crypto'
import * as zod from 'zod'

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

// app.get("/users", (req, reply) => {
//   const { id } = req.headers as { id: string };

//   const userHasAnValidId = listOfUsers.some((user) => user.id === id);
//   console.log(userHasAnValidId);

//   if (!userHasAnValidId) {
//     return reply.status(400).send(
//       {
//         error: "User not found!",
//       }
//     );
//   }

//   return listOfUsers;
// });

app.post("/users", (req , reply) => {
  const registerUserSchema = zod.object({
    name: zod.string().min(3, "Name must be at least 3 characters"),
    email: zod.string().email("Invalid email"),
  });

  const { name, email } = registerUserSchema.parse(req.body);

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
    return reply.status(201).send(user);


  }

});

app.listen({
  port: 3333,
}).then(() => {
  console.log("Server started at http://localhost:3333");
});