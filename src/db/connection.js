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
        token VARCHAR(255) NOT NULL,
        phone VARCHAR(255),
        locatrion VARCHAR(255)
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
          image VARCHAR(255) NOT NULL,
          requirements VARCHAR(255) NOT NULL,
          status VARCHAR(255) NOT NULL,
          admin_approval tinyint NULL,
          rejection_reason text NULL

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
                comment TEXT NOT NULL,
                tasker VARCHAR(255)
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
                  

                   // Create chat_rooms table (must be created before messages)
                   con.query(
                    `CREATE TABLE IF NOT EXISTS chat_rooms (
                      id INT AUTO_INCREMENT PRIMARY KEY,
                      roomId VARCHAR(255) NOT NULL UNIQUE,
                      user1 VARCHAR(255) NOT NULL,
                      user2 VARCHAR(255) NOT NULL,
                      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      FOREIGN KEY (user1) REFERENCES Users(userId) ON DELETE CASCADE,
                      FOREIGN KEY (user2) REFERENCES Users(userId) ON DELETE CASCADE
                    )`,
                    (err) => {
                      if (err) {
                        console.error("Error creating chat_rooms table:", err);
                        throw err;
                      }
                      console.log('Table "chat_rooms" created or exists');

                      //  Create messages table (depends on chat_rooms and Users)
                      con.query(
                        `CREATE TABLE IF NOT EXISTS messages (
                          id VARCHAR(255) PRIMARY KEY,
                          roomId VARCHAR(255) NOT NULL,
                          sender VARCHAR(255) NOT NULL,
                          receiver VARCHAR(255) NOT NULL,
                          message TEXT NOT NULL,
                          readAt DATETIME DEFAULT NULL,
                          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          FOREIGN KEY (roomId) REFERENCES chat_rooms(roomId) ON DELETE CASCADE,
                          FOREIGN KEY (sender) REFERENCES Users(userId) ON DELETE CASCADE,
                          FOREIGN KEY (receiver) REFERENCES Users(userId) ON DELETE CASCADE
                        )`,
                        (err) => {
                          if (err) {
                            console.error("Error creating messages table:", err);
                            throw err;
                          }
                          console.log('Table "messages" created or exists');

                          con.query(`CREATE TABLE  IF NOT EXISTS reviews (
                            id VARCHAR(255) PRIMARY KEY,
                            task_id VARCHAR(255) NOT NULL,
                            reviewer_id VARCHAR(255) NOT NULL,
                            reviewee_id VARCHAR(255) NOT NULL,
                            rating FLOAT CHECK (rating BETWEEN 1 AND 5),
                            review TEXT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        )`,
                        (err) => {
                          if (err) {
                            console.error("Error creating reviews table:", err);
                            throw err;
                          }
                          console.log('Table "reviews" created or exists');
                           // Create notifications table
                           con.query(
                            `CREATE TABLE  IF NOT EXISTS notifications (
                              id VARCHAR(255) PRIMARY KEY,
                              userId VARCHAR(255) NOT NULL,
                              type VARCHAR(50) NOT NULL DEFAULT 'message',
                              roomId VARCHAR(255),
                              senderId VARCHAR(255),
                              message TEXT,
                              isUnread BOOLEAN DEFAULT true,
                              createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              INDEX (userId),
                              INDEX (isUnread)
                              );`,
                            (err) => {
                              if (err) {
                                console.error("Error creating notifications table:", err);
                                throw err;
                              }
                              console.log('Table "notifications" created or exists');

                              console.log("All tables created successfully");
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
    });
  });


module.exports = con;