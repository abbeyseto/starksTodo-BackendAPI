const express = require("express");
const {
  getusers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const router = express.Router({ mergeParams: true });

router.route("/").get(getusers).post(addUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
