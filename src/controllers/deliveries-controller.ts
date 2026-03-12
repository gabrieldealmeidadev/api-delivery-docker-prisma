import { Request, Response } from "express";

class DeliveriesController {
  async index(request: Request, response: Response) {
    return response.status(200).json("ok index");
  }
  async create(request: Request, response: Response) {
    return response.status(200).json("ok create");
  }
}

export { DeliveriesController };
