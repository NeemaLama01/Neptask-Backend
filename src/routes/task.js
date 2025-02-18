const express = require("express");
const router = express.Router();

const { createTask } = require("../controllers/createtask");
const { getAllTask  } = require("../controllers/showAlltask");
const { getTaskById } = require("../controllers/showtask");
const { postTask  } = require("../controllers/posttask");
const { getActiveTask  } = require("../controllers/activetask");
const {getArchiveTask } = require("../controllers/archivetask");
const {updateTask } = require("../controllers/updatetask");

router.route("/create-task").post(createTask);
router.route("/get-All-Task").get(getAllTask);
router.route("/show-task/:id").get(getTaskById);
router.route("/post-task").post(postTask);
router.route("/get-Active-Task").get(getActiveTask);
router.route("/get-Archive-Task").get(getArchiveTask);
router.route("/updateTask/:id").put(updateTask);


module.exports = router;
