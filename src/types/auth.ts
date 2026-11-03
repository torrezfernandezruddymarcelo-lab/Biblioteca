export type UserRole = "ADMIN_PRINCIPAL" | "ADMIN" | "DOCENTE" | "USUARIO";

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

export interface RegisterData {
  name: string;
  carnet: string;
  password: string;
  accountType: "ALUMNO" | "DOCENTE";
}

export interface TeacherRequest {
  id: string;
  userId: string;
  userName: string;
  carnet: string;
  requestedAt: string;
  status: "Pendiente" | "Aprobada" | "Rechazada";
}
