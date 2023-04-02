![enter image description here](https://camo.githubusercontent.com/c1961440b3cd295d2e75cbe71c7177fb4474f5eb8cbe53e359b112e4128723ac/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f646c6f6164623262782f696d6167652f75706c6f61642f76313637343532333539362f34326531616238302d373761662d313165622d396530372d3437663965343662336536655f61786f636e6e2e706e67)

# Daily Diet API
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)  ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)  ![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)

The Daily Diet API it's a project develop as a challenge along the specialization in NodeJS from Rocketseat, the goal it's to create a complete API that allows a user create a account and register their meals along the day. The user can only edit or delete the meals that he creates. Will also add a complete information about the meals, like how many consecutive days the user eat foods that are in their diet list. 

To create more friendly query searchs the Knex was used and in the development the Sqlite3 was used as a database.

To check if user id exists or if is the users who creates a meals is the one who tries to edit it, was create two separate middlewares. 

## What user can do on this API

- Users
	- [Get] Check me route /me to see their own information
	- [Post] Create new user
- Meals
	- [Get] Get the information about one meal
	- [Get] List of all meals from one user
	- [Post] Create a new meal
	- [Put] Edit a meal
	- [Delete] Delete a meal
- Metrics
	- [Get] Retrieve all informations about a user meals

![enter image description here](https://res.cloudinary.com/dloadb2bx/image/upload/v1680472829/apidiet_yua016.png)
## To create a user

    {
    	"name": "Jack Ryan Jr",
    	"email": "jackryanjr@gmail.com"
    }

## To create a meal

    {
    	"name": "Pizza",
    	"description": "An amazing pizza to put end on your diet",
    	"date": "03-29-2023",
    	"time": "21:15",
    	"isOnDiet": false
    }