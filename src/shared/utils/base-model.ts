import { v4 as uuid } from "uuid";

export class BaseModel {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  constructor() {
    this.id = uuid();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
