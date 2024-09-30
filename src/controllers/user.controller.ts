import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateJWT } from "../helpers/GenerateJWT";
import Users from "../models/user.model"; // Asegúrate de que la ruta sea correcta

const createUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    const existingUserByEmail = await Users.findOne({ where: { email } });
    const existingUserByUsername = await Users.findOne({ where: { username } });

    if (existingUserByUsername) {
      res.status(400).json({ ok: false, msg: "Username exists in database!" });
      return;
    }

    if (existingUserByEmail) {
      res.status(400).json({ ok: false, msg: "Email exists!" });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ ok: false, msg: "Passwords do not match!" });
      return;
    }

    const bcryptSalts = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, bcryptSalts);

    const dbUser = await Users.create({
      username,
      email,
      password: hashedPassword,
      status: true,
      confirmPassword: false, // No lo guardes, pero puedes omitirlo
    });

    const token = generateJWT(dbUser.id, dbUser.email);

    res.status(200).json({
      ok: true,
      msg: "User created successfully",
      _idUser: dbUser.id,
      email: dbUser.email,
      token,
    });
  } catch (err) {
    res.status(500).json({ ok: false, msg: "Error creating user" });
  }
};

const loginUsers = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const dbUser = await Users.findOne({ where: { email } });

    if (!dbUser) {
      res.status(400).json({ ok: false, msg: "User not registered" });
      return;
    }

    const validPassword = bcrypt.compareSync(password, dbUser.password);
    if (!validPassword) {
      res.status(400).json({ ok: false, msg: "Invalid password" });
      return;
    }

    const token = generateJWT(dbUser.id, dbUser.email);

    res.status(200).json({
      ok: true,
      msg: "Welcome back!",
      _idUser: dbUser.id,
      email: dbUser.email,
      token,
    });
  } catch (err) {
    res.status(500).json({ ok: false, msg: "Error logging in" });
  }
};

const getUsersById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await Users.findByPk(id); // Cambiado a findByPk para buscar por ID
    if (!user) {
      res.status(404).json({ ok: false, msg: "User not found!" });
      return;
    }
    res.status(200).json({ msg: user });
  } catch (err) {
    res.status(500).json({ ok: false, msg: (err as Error).message });
  }
};

const getUsersByEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.params;
  try {
    const users = await Users.findAll({ where: { email } });
    res.status(200).json({ msg: users });
  } catch (err) {
    res.status(500).json({ ok: false, msg: (err as Error).message });
  }
};

const getUsersByStatus = async (req: Request, res: Response): Promise<void> => {
  const { status } = req.params;
  try {
    const users = await Users.findAll({ where: { status } });
    res.status(200).json({ msg: users });
  } catch (err) {
    res.status(500).json({ ok: false, msg: (err as Error).message });
  }
};

const getUsersByUsername = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  try {
    const users = await Users.findAll({ where: { username } });
    res.status(200).json({ msg: users });
  } catch (err) {
    res.status(500).json({ ok: false, msg: (err as Error).message });
  }
};

const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await Users.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ ok: false, msg: (err as Error).message });
  }
};

const validateToken = async (req: Request, res: Response): Promise<void> => {
  const { _idUser, email } = req.body;

  const token = generateJWT(_idUser, email);

  res.status(200).json({
    ok: true,
    msg: "Token generated successfully",
    _idUser,
    email,
    token,
  });
};

const updateUsers = async (req: Request, res: Response): Promise<void> => {
  const { email, username, password } = req.body;

  try {
    const dbUser = await Users.findByPk(req.params.id); // Cambiado a findByPk para buscar por ID

    if (!dbUser) {
      res.status(404).json({ ok: false, msg: "User not found!" });
      return;
    }

    const existingUserByEmail = await Users.findOne({ where: { email } });
    const existingUserByUsername = await Users.findOne({ where: { username } });

    if (existingUserByUsername && existingUserByUsername.id !== dbUser.id) {
      res.status(400).json({ ok: false, msg: "Username exists in database!" });
      return;
    }

    if (existingUserByEmail && existingUserByEmail.id !== dbUser.id) {
      res.status(400).json({ ok: false, msg: "Email registered in database!" });
      return;
    }

    const bcryptSalts = bcrypt.genSaltSync(10);
    dbUser.username = username;
    dbUser.email = email;
    dbUser.password = bcrypt.hashSync(password, bcryptSalts);

    const token = generateJWT(dbUser.id, dbUser.email);

    await dbUser.save();

    res.status(200).json({ ok: true, msg: "User updated!", dbUser, token });
  } catch (err) {
    res.status(400).json({ ok: false, msg: "User not updated" });
  }
};

const deleteUsers = async (req: Request, res: Response): Promise<void> => {
  const { idUser } = req.body;

  try {
    const dbUser = await Users.findByPk(idUser); // Cambiado a findByPk para buscar por ID
    if (!dbUser) {
      res.status(404).json({ ok: false, msg: "User not found!" });
      return;
    }

    dbUser.status = false; // Cambia el estado en lugar de eliminar
    await dbUser.save();

    res.status(200).json({ ok: true, msg: "User deleted!" });
  } catch (err) {
    res.status(400).json({ ok: false, msg: "User not deleted!" });
  }
};

export {
  createUsers,
  loginUsers,
  getUsers,
  validateToken,
  updateUsers,
  deleteUsers,
  getUsersById,
  getUsersByEmail,
  getUsersByUsername,
  getUsersByStatus,
};

