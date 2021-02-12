import { Request, Response, NextFunction } from "express";

import Joi from "joi";

export function validate(schema: Joi.Schema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}
