const express = require("express");
const router = express.Router();

const { createTask } = require("../controllers/createtask");
const { getAllTask  } = require("../controllers/showAlltask");
const { getTaskById } = require("../controllers/showtask");
const { applyTask  } = require("../controllers/applytask");
const { getActiveTask  } = require("../controllers/activetask");
const {getArchiveTask } = require("../controllers/archivetask");
const {updateTask } = require("../controllers/updatetask");
const {getTasker } = require("../controllers/gettasker");
const {insertTasker } = require("../controllers/updatetasker");
const {acceptedTask} = require("../controllers/acceptedtask");
const {acceptedTasker} = require("../controllers/acceptedtasker");
const {commentTask} = require("../controllers/commenttask");
const {pendingTask} = require("../controllers/pendingtask");




router.route("/create-task").post(createTask);
router.route("/get-All-Task").get(getAllTask);
router.route("/show-task/:id").get(getTaskById);
//router.route("/post-task").post(postTask);
router.route("/get-Active-Task").get(getActiveTask);
router.route("/get-Archive-Task").get(getArchiveTask);
router.route("/updateTask/:id").put(updateTask);
router.route("/apply-task").post(applyTask);
router.route("/get-tasker/:id").get(getTasker);
router.route("/update-tasker").post(insertTasker);
router.route("/accepted-tasks").get(acceptedTask);
router.route("/accepted-tasker").get(acceptedTasker);
router.route("/comment").put(commentTask);
router.route("/pending-task").get(pendingTask);


module.exports = router;
