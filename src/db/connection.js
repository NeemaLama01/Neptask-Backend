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
        profile_image VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL
      )`, (err) => {
        if (err) {
          console.error('Error creating Users table:', err);
          throw err;
        }
        console.log('Table "Users" created or exists');

        con.query(`CREATE TABLE IF NOT EXISTS tasklisting (
          userId VARCHAR(255) NOT NULL,
          id VARCHAR(255) NOT NULL PRIMARY KEY,  -- Added PRIMARY KEY
          taskTitle VARCHAR(255) NOT NULL,
          taskInfo TEXT NOT NULL,
          taskType VARCHAR(255) NOT NULL,
          priceRange VARCHAR(255) NOT NULL,
          requirements VARCHAR(255) NOT NULL,
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

              con.query(`CREATE TABLE IF NOT EXISTS applied_task (
                taskID VARCHAR(255) NOT NULL,  -- Removed PRIMARY KEY.  A tasker can apply to multiple tasks.
                taskerID VARCHAR(255) NOT NULL, -- Added taskerID
                PRIMARY KEY (taskID, taskerID),      -- Composite Primary Key
                offerPrice DECIMAL(10,2) NOT NULL, 
                comment TEXT NOT NULL
              )`, (err) => {
                if (err) {
                  console.error('Error creating applied_task table:', err);
                  throw err;
                }
                console.log('Table "applied_task" created or exists');

                con.query(`CREATE TABLE IF NOT EXISTS tasker_task (
                  taskerId VARCHAR(255) PRIMARY KEY,
                  task_info TEXT  -- Consider renaming to something more descriptive, like "interested_tasks"
                )`, (err) => {
                  if (err) {
                    console.error('Error creating tasker_task table:', err);
                    throw err;
                  }
                  console.log('Table "tasker_task" created or exists');

                con.query(`CREATE TABLE IF NOT EXISTS accepted_task (
                    taskId VARCHAR(255),
                    taskerId VARCHAR(255),
                    status boolean,
                    rejectionReason TEXT
                  )`, (err) => {
                    if (err) {
                      console.error('Error creating accepted_task table:', err);
                      throw err;
                    }
                    console.log('Table "accepted_task" created or exists');

                    con.query(`CREATE TABLE IF NOT EXISTS user_friends (
                      userId VARCHAR(255) NOT NULL,  
                      friendId VARCHAR(255) NOT NULL,
                      PRIMARY KEY (userID, friendID)      
                    )`, (err) => {
                      if (err) {
                        console.error('Error creating user_friends table:', err);
                        throw err;
                      }
                      console.log('Table "user_friends" created or exists');

                    con.query(`CREATE TABLE IF NOT EXISTS paymentintegration (
                          PaymentId VARCHAR(255) PRIMARY KEY,
                          taskposter VARCHAR(255),
                          email VARCHAR(255),
                          phone VARCHAR(20),
                          task TEXT,
                          payment VARCHAR(50),
                          status VARCHAR(50) DEFAULT 'Pending'
                    )`, (err) => {
                      if (err) {
                          console.error('Error creating PaymentIntegration table:', err);
                          throw err;
                      }
                      console.log('Table "PaymentIntegration" created or already exists');
                  

                  // Creating the Conversation table
              con.query(`CREATE TABLE IF NOT EXISTS Conversation (
                  conversationId INT AUTO_INCREMENT PRIMARY KEY,
                  members JSON NOT NULL
                  )`, (err) => {
                    if (err) {
                        console.error('Error creating Conversation table:', err);
                        throw err;
                    }
                    console.log('Table "Conversation" created or exists');

                // Creating the Message table
                con.query(`CREATE TABLE IF NOT EXISTS Message (
                    id VARCHAR(255) NOT NULL PRIMARY KEY,
                    conversationId INT NOT NULL,  -- Changed to INT for consistency
                    senderId VARCHAR(255) NOT NULL,
                    message TEXT NOT NULL,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (conversationId) REFERENCES Conversation(conversationId) -- foreign key reference
                )`, (err) => {
                    if (err) {
                        console.error('Error creating Message table:', err);
                        throw err;
                    }
                    console.log('Table "Message" created or exists');
                  });
                   });
                  });
                 });
                });
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