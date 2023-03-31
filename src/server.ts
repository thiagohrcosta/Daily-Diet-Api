import fastify from 'fastify';

import { randomUUID } from 'node:crypto'
import * as zod from 'zod'
import { CheckUserIdExists } from './middlewares/check-if-id-exists';

const app = fastify();

interface UserProps {
  id: string;
  name: string;
  email: string;
}

const listOfUsers: UserProps[] = [];

interface MealProps {
  id: string;
  name: string;
  description: string;
  datetime: string;
  isOnDiet: boolean;
  userId: string;
}

const listOfMeals: MealProps[] = [];

app.get("/", () => {
  return { hello: "world" };
});

app.get("/me", {
  preHandler: [CheckUserIdExists]
}, (req, reply) => {
  const { id } = req.headers as { id: string };

  const user = listOfUsers.find((user) => user.id === id);

  return user;
});

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
    console.log(user);
  }

  return reply.status(201).send();

});

app.post("/meals", {
  preHandler: [CheckUserIdExists]
}, async (req, reply) => {
  const createMealSchema = zod.object({
    name: zod.string().min(3, "Name must be at least 3 characters"),
    description: zod.string().min(3, "Description must be at least 3 characters"),
    isOnDiet: zod.boolean(),
  });

  const { name, description, isOnDiet } = createMealSchema.parse(req.body);

  const { id } = req.headers as { id: string };

  const meal = {
    id: randomUUID(),
    name,
    description,
    datetime: new Date().toISOString(),
    isOnDiet,
    userId: id,
  };

  listOfMeals.push(meal);
  return reply.status(201).send(meal);
});

app.put("/meals/:id", {
  preHandler: [CheckUserIdExists]
}, async (req, reply) => {
  const updateMealSchema = zod.object({
    name: zod.string().min(3, "Name must be at least 3 characters"),
    description: zod.string().min(3, "Description must be at least 3 characters"),
    isOnDiet: zod.boolean(),
  });

  const { name, description, isOnDiet } = updateMealSchema.parse(req.body);

  const { id } = req.params as { id: string };

  const mealIndex = listOfMeals.findIndex((meal) => meal.id === id);

  if (mealIndex < 0) {
    return reply.status(404).send({
      error: "Meal not found",
    });
  }

  listOfMeals[mealIndex] = {
    ...listOfMeals[mealIndex],
    name,
    description,
    isOnDiet,
    datetime: new Date().toISOString(),
  };

  return reply.status(200).send(listOfMeals[mealIndex]);
});

app.delete("/meals/:id", {
  preHandler: [CheckUserIdExists]
}, async (req, reply) => {
  const { id } = req.params as { id: string };

  const mealIndex = listOfMeals.findIndex((meal) => meal.id === id);

  if (mealIndex < 0) {
    return reply.status(404).send({
      error: "Meal not found",
    });
  }

  listOfMeals.splice(mealIndex, 1);
  return reply.status(200).send();
});

app.get("/meals", {
  preHandler: [CheckUserIdExists]
}, async (req, reply) => {
  const { id } = req.headers as { id: string };

  const meals = listOfMeals.filter((meal) => meal.userId === id);

  return reply.status(200).send(meals);
});

app.get("/meals/:id", {
  preHandler: [CheckUserIdExists]
}, async (req, reply) => {
  const { id } = req.params as { id: string };

  const meal = listOfMeals.find((meal) => meal.id === id);

  if (!meal) {
    return reply.status(404).send({
      error: "Meal not found",
    });
  }

  return reply.status(200).send(meal);
});

app.listen({
  port: 3333,
}).then(() => {
  console.log("Server started at http://localhost:3333");
});