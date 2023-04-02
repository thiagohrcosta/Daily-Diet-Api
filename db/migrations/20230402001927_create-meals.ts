import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals',(table) => {
    table.uuid('id').primary().notNullable()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.date('date').notNullable()
    table.string('time').notNullable()
    table.boolean('isOnDiet').notNullable()
    table.uuid('user_id').notNullable().references('id').inTable('users')
  })
}


export async function down(knex: Knex): Promise<void> {
}

