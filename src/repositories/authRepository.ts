import initialUsers from "../data/users.json";
import { storageService } from "../services/storageService";

import type {
  LoginCredentials,
  RegisterData,
  TeacherRequest,
  User,
  UserRecord,
} from "../types/auth";

const USERS_KEY = "biblioteca_users";
const SESSION_KEY = "app_session";
const TEACHER_REQUESTS_KEY = "biblioteca_teacher_requests";
const PRINCIPAL_ADMIN_ID = "user-1";

const getUsers = (): UserRecord[] => {
  const storedUsers = storageService.get<UserRecord[]>(USERS_KEY);
  const users = storedUsers ?? (initialUsers as UserRecord[]);
  const updatedUsers = users.map((item) =>
    item.id === PRINCIPAL_ADMIN_ID
      ? { ...item, role: "ADMIN_PRINCIPAL" as const }
      : item
  );

  if (
    !storedUsers ||
    updatedUsers.some((item, index) => item.role !== users[index]?.role)
  ) {
    storageService.set(USERS_KEY, updatedUsers);
  }

  return updatedUsers;
};

const saveUsers = (users: UserRecord[]): void => {
  storageService.set(USERS_KEY, users);
};

const getTeacherRequests = (): TeacherRequest[] =>
  storageService.get<TeacherRequest[]>(TEACHER_REQUESTS_KEY) ?? [];

const saveTeacherRequests = (requests: TeacherRequest[]): void => {
  storageService.set(TEACHER_REQUESTS_KEY, requests);
};

export const authRepository = {
  login(credentials: LoginCredentials): User | null {
    const carnet = credentials.carnet.trim();
    const foundUser = getUsers().find(
      (item) => item.carnet === carnet && item.password === credentials.password
    );

    if (!foundUser) return null;

    const sessionUser: User = {
      id: foundUser.id,
      name: foundUser.name,
      carnet: foundUser.carnet,
      role: foundUser.role,
    };
    storageService.set(SESSION_KEY, sessionUser);
    return sessionUser;
  },

  register(data: RegisterData): { success: boolean; message: string } {
    const users = getUsers();
    const carnet = data.carnet.trim();

    if (!data.name.trim() || !carnet || !data.password.trim()) {
      return { success: false, message: "Completa todos los campos." };
    }
    if (users.some((item) => item.carnet === carnet)) {
      return { success: false, message: "Este carnet ya está registrado." };
    }

    const newUser: UserRecord = {
      id: crypto.randomUUID(),
      name: data.name.trim(),
      carnet,
      password: data.password,
      role: "USUARIO",
    };
    saveUsers([...users, newUser]);

    if (data.accountType === "DOCENTE") {
      const requests = getTeacherRequests();
      requests.push({
        id: crypto.randomUUID(),
        userId: newUser.id,
        userName: newUser.name,
        carnet: newUser.carnet,
        requestedAt: new Date().toISOString(),
        status: "Pendiente",
      });
      saveTeacherRequests(requests);
      return {
        success: true,
        message: "Registro realizado. Tu solicitud para ser docente quedó pendiente de aprobación del administrador principal.",
      };
    }

    return {
      success: true,
      message: "Registro de alumno realizado correctamente.",
    };
  },

  getTeacherRequests(): TeacherRequest[] {
    return getTeacherRequests();
  },

  reviewTeacherRequest(requestId: string, decision: "Aprobada" | "Rechazada"): boolean {
    if (!this.isPrincipalAdmin()) return false;

    const requests = getTeacherRequests();
    const request = requests.find((item) => item.id === requestId);
    if (!request || request.status !== "Pendiente") return false;

    if (decision === "Aprobada") {
      const users = getUsers();
      const exists = users.some((item) => item.id === request.userId);
      if (!exists) return false;

      saveUsers(users.map((item) =>
        item.id === request.userId ? { ...item, role: "DOCENTE" as const } : item
      ));
    }

    saveTeacherRequests(requests.map((item) =>
      item.id === requestId ? { ...item, status: decision } : item
    ));
    return true;
  },

  logout(): void {
    storageService.remove(SESSION_KEY);
  },

  getCurrentUser(): User | null {
    return storageService.get<User>(SESSION_KEY);
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === "ADMIN" || user?.role === "ADMIN_PRINCIPAL";
  },

  isPrincipalAdmin(): boolean {
    const user = this.getCurrentUser();
    return user !== null && user.id === PRINCIPAL_ADMIN_ID && user.role === "ADMIN_PRINCIPAL";
  },

  promoteToAdmin(userId: string): boolean {
    if (userId === PRINCIPAL_ADMIN_ID) return false;
    const users = getUsers();
    if (!users.some((item) => item.id === userId)) return false;
    saveUsers(users.map((item) =>
      item.id === userId ? { ...item, role: "ADMIN" as const } : item
    ));
    return true;
  },
};
