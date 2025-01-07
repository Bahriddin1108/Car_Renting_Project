const db = require("../config/db");
const User = db.user;
const Roles = db.role;
const bcrypt = require("bcrypt");

const addNewUser = async (req, res) => {
  try {
    const { customAlphabet } = await import("nanoid"); // Dinamik import va destructuring
    const nanoid = customAlphabet("1234567890", 8);
    const id = nanoid();
    const { username, email, password, role_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const users = await User.findAll();
    const roles=await Roles.findAll();
    const usernameExists = users.some((user) => user.username === req.body.username);
    const emailExists = users.some((user) => user.email === req.body.email);
    const idExists = roles.some((user) => user.id === req.body.role_id);

    if (!validateEmail(req.body.email)) {
      return res.status(400).json({
        message: "Validation error",
        error: "please enter valid email with @ and .",
      });
    }
    if (usernameExists) {
      return res.status(409).json({
        message: "Conflict",
        error: "Username already exists",
      });
    }

    if (emailExists) {
      return res.status(409).json({
        message: "Conflict",
        error: "Email already exists",
      });
    }
    
    if (!idExists) {
      return res.status(409).json({
        message: "Conflict",
        error: "This role id is not existed",
      });
    }
    const user = await User.create({
      id: id,
      username: username,
      email: email,
      password: hashedPassword,
      role_id: role_id,
    });

    res.status(200).json({
      message: "Success",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      message: "Success",
      users: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: `No user found with id:${req.params.id}`,
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.update(
      {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        role_id: req.body.role_id,
      },
      {
        where: { id: req.params.id },
      }
    );

    return res.status(200).json({
      message: "Successfully updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: `No user found with id:${req.params.id}`,
      });
    }
    await User.destroy({ where: { id: req.params.id } });

    return res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  addNewUser,
  getUsers,
  updateUser,
  deleteUser,
};
