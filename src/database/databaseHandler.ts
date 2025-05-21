import Sequelize from "@sequelize/core";
import { SqliteDialect } from "@sequelize/sqlite3";
import Event from "./event.model";

export const sequelize = new Sequelize({
  dialect: SqliteDialect,
  storage: "./storage.sqlite",
  models: [Event],
});

export async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log("The database has been connected successfully.");
    await Event.sync({ alter: true });
    console.log("Event model has been synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
