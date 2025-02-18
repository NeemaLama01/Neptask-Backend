const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

con.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err; // This will stop the script execution
  }
  console.log('Connected to MySQL');

  con.query("CREATE DATABASE IF NOT EXISTS NepTask", (err) => {
    if (err) {
      console.error('Error creating database:', err);
      throw err;
    }
    console.log('Database "NepTask" created or exists');

    con.query("USE NepTask", (err) => {
      if (err) {
        console.error('Error using database:', err);
        throw err;
      }
      console.log('Using database "NepTask"');

      // Create the "Users" table if it doesn't exist
      con.query(`CREATE TABLE IF NOT EXISTS Users (
        userId VARCHAR(100) NOT NULL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL
      )`, (err) => {
        if (err) {
          console.error('Error creating Users table:', err);
          throw err;
        }
        console.log('Table "Users" created or exists');

        con.query(`CREATE TABLE IF NOT EXISTS tasklisting (
          id VARCHAR(255) NOT NULL PRIMARY KEY,  -- Added PRIMARY KEY
          taskTitle VARCHAR(255) NOT NULL,
          taskInfo TEXT NOT NULL,
          taskType VARCHAR(255) NOT NULL,
          taskStage VARCHAR(255) NOT NULL,
          requirements VARCHAR(255) NOT NULL,
          priceRange VARCHAR(255) NOT NULL,
          status VARCHAR(255) NOT NULL
        )`, (err) => {
          if (err) {
            console.error('Error creating tasklisting table:', err);
            throw err;
          }
          console.log('Table "tasklisting" created or exists');

          con.query(`CREATE TABLE IF NOT EXISTS taskposter_info (
            id VARCHAR(255) NOT NULL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255)
          )`, (err) => {
            if (err) {
              console.error('Error creating taskposter_info table:', err); // Corrected table name in error message
              throw err;
            }
            console.log('Table "taskposter_info" created or exists'); // Corrected table name in log

            con.query(`CREATE TABLE IF NOT EXISTS tasker_info (
              id VARCHAR(255) NOT NULL PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              email VARCHAR(255),
              status BOOLEAN
            )`, (err) => {
              if (err) {
                console.error('Error creating tasker_info table:', err);
                throw err;
              }
              console.log('Table "tasker_info" created or exists');

              con.query(`CREATE TABLE IF NOT EXISTS posted_task (
                taskID VARCHAR(255) NOT NULL,  -- Removed PRIMARY KEY.  A tasker can apply to multiple tasks.
                taskerID VARCHAR(255) NOT NULL, -- Added taskerID
                PRIMARY KEY (taskID, taskerID)      -- Composite Primary Key
              )`, (err) => {
                if (err) {
                  console.error('Error creating posted_task table:', err);
                  throw err;
                }
                console.log('Table "posted_task" created or exists');

                con.query(`CREATE TABLE IF NOT EXISTS tasker_task (
                  taskerId VARCHAR(255) PRIMARY KEY,
                  task_info TEXT  -- Consider renaming to something more descriptive, like "interested_tasks"
                )`, (err) => {
                  if (err) {
                    console.error('Error creating tasker_task table:', err);
                    throw err;
                  }
                  console.log('Table "tasker_task" created or exists');
                });
              });
            });
          });
        });
      });
    });
  });
});

module.exports = con;