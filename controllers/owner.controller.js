import User from "../models/user.models.js";
import { errorHandler } from "../utils/error.js";

export const makeAdmin = async (req, res, next) => {
  try {
    const owner = await User.findById(req.user.id);
    if (owner.role !== "owner")
      return next(errorHandler(401, "you are not the owner"));
    try {
      const user = await User.findById(req.params.id);

      if (!user) return next(errorHandler(401, "No such user is there"));

      if (!user.role) {
        user.role = "admin";
        await user.save();
      } else {
        user.role = undefined;
        await user.save();
      }

      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
