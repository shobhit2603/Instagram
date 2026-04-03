import { param } from "express-validator";
import { validate } from "./auth.validator";

export const followUserValidator = [
  param("userId").notEmpty().withMessage("User ID is required"),
  validate,
];