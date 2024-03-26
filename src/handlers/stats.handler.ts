import { FastifyInstance } from 'fastify';

export class StatsHandler {
  public constructor(private readonly app: FastifyInstance) {
    this.app = app;
  }
}
