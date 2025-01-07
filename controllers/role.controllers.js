const db = require("../config/db");
const Role=db.role

const addNewRole = async (req, res) => {
  try {
    const { customAlphabet } = await import("nanoid"); // Dinamik import va destructuring
    const nanoid = customAlphabet("1234567890", 8);
    const id = nanoid();
    const {role_name } = req.body;
     const users = await Role.findAll();

    const usernameExists = users.some((user) => user.role_name === req.body.role_name);
    
    if (usernameExists) {
      return res.status(409).json({
        message: "Conflict",
        error: "Role already exists",
      });
    }


    const role = await Role.create({
      id: id,
      role_name: role_name
    });

    res.status(200).json({
      message: "Success",
      role: role,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};
const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json({
      message: "Success",
      roles: roles,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};
const updateRole = async (req, res) => {
  try {
    const user = await Role.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: `No user found with id:${req.params.id}`,
      });
    }

    await Role.update(
      {
        role_name: req.body.role_name,
        
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
const deleteRole = async (req, res) => {
  try {
    const user = await Role.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: `No user found with id:${req.params.id}`,
      });
    }
    await Role.destroy({ where: { id: req.params.id } });

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


module.exports = {
  addNewRole,
  getRoles,
  updateRole,
  deleteRole,
};
