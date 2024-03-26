import { Role } from '@prisma/client';
import { RouteGenericInterface } from 'fastify/types/route';

export interface CreateUserRouteInterface extends RouteGenericInterface {
  Body: {
    firstName: string;
    lastName: string;
    email: string;
    orgName: string;
    password: string;
  };
}

export interface AddUserToOrgRouteInterface extends RouteGenericInterface {
  Body: {
    firstName: string;
    lastName: string;
    email: string;
    orgId: string;
    role: UserRole;
  };
}

export interface UpdatePasswordRouteInterface extends RouteGenericInterface {
  Body: {
    oldPassword: string;
    newPassword: string;
  };
}

export type UserRole = Role;
