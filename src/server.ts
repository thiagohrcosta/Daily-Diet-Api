import fastify from 'fastify';

import crypto from 'node:crypto'
import * as zod from 'zod'
import { CheckUserIdExists } from './middlewares/check-if-id-exists';
import { knex } from './database';

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
  date: string;
  time: string;
  isOnDiet: boolean;
  userId: string;
}

const listOfMeals: MealProps[] = [];

interface UserProps {
  id: string;
  name: string;
  email: string;
}

app.get("/me", {
  preHandler: [CheckUserIdExists]
}, (req, reply) => {
  const { id } = req.headers as { id: string };

  const user = knex('users').where('id', id).first();
  console.log(user)
  if(!user) {
    return reply.status(404).send({
      error: "User not found",
    });
  }

  return reply.status(200).send(user);
});

app.get("/test", async() => {
  const table = await knex('sqlite_schema').select('*');
})

app.post("/users", async (req , reply) => {
  const registerUserSchema = zod.object({
    name: zod.string().min(3, "Name must be at least 3 characters"),
    email: zod.string().email("Invalid email"),
  });

  const { name, email } = registerUserSchema.parse(req.body);

  const userAlreadyExists = await knex('users').where('email', email).first();
  console.log(userAlreadyExists)

  if (userAlreadyExists) {
    return reply.status(400).send({
      error: "User already exists",
    });
  }

  try {
    const user:UserProps = await knex('users').insert({
      id: crypto.randomUUID(),
      name,
      email,
    }).returning(['id', 'email']).into('users');
    return reply.status(201).send(user);
  } catch (error) {
    return reply.status(400).send({
      error: "Unexpected error while creating new user",
    });
  }
});

app.post("/meals", {
  preHandler: [CheckUserIdExists]
}, async (req, reply) => {
  const createMealSchema = zod.object({
    name: zod.string().min(3, "Name must be at least 3 characters"),
    description: zod.string().min(3, "Description must be at least 3 characters"),
    date: zod.string().min(6, "Date must be at least 6 characters"),
    time: zod.string().min(4, "Time must be at least 4 characters"),
    isOnDiet: zod.boolean(),
  });

  const { name, description, date, time, isOnDiet } = createMealSchema.parse(req.body);

  const { id } = req.headers as { id: string };

  const userExists = listOfUsers.some((user) => user.id === id);

  if (!userExists) {
    return reply.status(404).send({
      error: "User not found",
    });
  }

  const meal = {
    id: crypto.randomUUID(),
    name,
    description,
    date,
    time,
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
    date: zod.string().min(6, "Date must be at least 6 characters"),
    time: zod.string().min(4, "Time must be at least 4 characters"),
    isOnDiet: zod.boolean(),
  });

  const { name, description, time, date, isOnDiet } = updateMealSchema.parse(req.body);

  const { id: userId } = req.headers as { id: string };
  const { id: mealId } = req.params as { id: string };

  const mealIndex = listOfMeals.findIndex((meal) => meal.id === mealId);

  const findUser = listOfUsers.find((user) => user.id === userId);

  if (findUser === undefined) {
    return reply.status(404).send({
      error: "User not found",
    });
  }

  if (findUser.id !== userId) {
    return reply.status(401).send({
      error: "Unauthorized",
    });
  }

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
    date,
    time,
  };

  return reply.status(200).send(listOfMeals[mealIndex]);
});

app.delete("/meals/:id", {
  preHandler: [CheckUserIdExists]
}, async (req, reply) => {
  const { id: userId } = req.headers as { id: string };
  const { id: mealId } = req.params as { id: string };

  const mealIndex = listOfMeals.findIndex((meal) => meal.id === mealId);

  const findMeal = listOfMeals.find((meal) => meal.id === mealId);

  const findUser = listOfUsers.find((user) => user.id === userId);

  if (findUser === undefined) {
    return reply.status(404).send({
      error: "User not found",
    });
  }

  if (findMeal?.userId !== userId) {
    return reply.status(401).send({
      error: "Unauthorized",
    });
  }
 
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
  const { id: userId } = req.headers as { id: string };

  const meals = listOfMeals.filter((meal) => meal.userId === userId);

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

app.get("/metrics/total", {}, async (req, reply) => {
  const { id } = req.headers as { id: string };

  let meals = listOfMeals.filter((meal) => meal.userId === id);

  let userExists = listOfUsers.find((user) => user.id === id);

  if (!userExists) {
    return reply.status(404).send({
      error: "User not found",
    });
  }

  if(meals.length === 0) {
    return reply.status(402).send({
      error: "No meals found",
    })
  }
  // filter order by date
  meals = meals.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  function calculator() {
    let sequence = 0;
    let maxSequence = 0;
    for (let i = 0; i < meals.length; i++) {
      if (meals[i].isOnDiet) {
        sequence++;
        if (sequence > maxSequence) {
          maxSequence = sequence;
        }
      } else {
        sequence = 0;
      }
    }
    return maxSequence;
  }

  return reply.status(200).send({
    total: meals.length,
    onDiet: meals.filter((meal) => meal.isOnDiet === true).length,
    onDietPercentage: (meals.filter((meal) => meal.isOnDiet === true).length / meals.length) * 100,
    notOnDiet: meals.filter((meal) => meal.isOnDiet === false).length,
    notOnDietPercentage: (meals.filter((meal) => meal.isOnDiet === false).length / meals.length) * 100,
    mealsSequenceOnDiet: calculator(),
  });
});

app.listen({
  port: 3333,
}).then(() => {
  console.log("Server started at http://localhost:3333");
});