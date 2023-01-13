import { NextFunction } from "express";
import ApiError from "../error/ApiError";

export default function (
  err: ApiError,
  req: any,
  res: any,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: "Непредвиденная ошибка!" });
}
