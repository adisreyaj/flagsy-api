import { RouteGenericInterface } from 'fastify/types/route';

export interface CreateUserRouteInterface extends RouteGenericInterface {
  Body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    orgName: string;
  };
}
