import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { generatePassword, generateUsername } from "../utils/help.js";

export const signup = async (req, res, next) => {
  const { username, email, password, fullname } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    fullname,
    password: hashedPassword,
  });

  try {
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = newUser._doc;

    res.cookie("acess_token", token, { httpOnly: true }).status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "credentials are not correct"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(404, "credentials are not correct"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    res.status(200).cookie("acess_token", token, { httpOnly: true }).json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;

      res
        .cookie("acess_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const password = generatePassword();
      const hashedPassword = bcryptjs.hashSync(password, 10);
      const newUser = new User({
        fullname: req.body.fullname,
        username: generateUsername(req.body.fullname),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;

      res
        .cookie("acess_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res.clearCookie("acess_token");
    res.status(200, "user deleted").json("cookies cleared");
  } catch (error) {
    next(error);
  }
};
