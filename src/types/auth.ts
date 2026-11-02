export type UserRole = "ADMIN" | "USUARIO";
export type AdminRequestStatus = "PENDIENTE" | "APROBADA" | "RECHAZADA";

export interface User {
  id: string;
  name: string;
  carnet: string;
  role: UserRole;
}

export interface UserRecord extends User {
  password: string;
}

export interface LoginCredentials {
  carnet: string;
  password: string;
}

export interface RegistrationData {
  name: string;
  carnet: string;
  password: string;
  requestedRole: UserRole;
}

export interface AdminRequest {
  id: string;
  name: string;
  carnet: string;
  password: string;
  status: AdminRequestStatus;
  requestedAt: string;
}
