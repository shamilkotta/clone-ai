import { type ErrorRequestHandler } from "express";
import ErrorResponse from "../services/error";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error(err);

  if (err instanceof ErrorResponse) {
    res.status(err.status).json({
      success: false,
      status: err.status,
      message: err.message,
      data: err.data
    });
    return;
  }
  res.status(500).json({
    success: false,
    status: 500,
    message: "Something went wrong"
  });
};

export default errorHandler;
