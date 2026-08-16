import { backendRequest } from "./client";
import {
  AuthResponse,
  CurrentUserResponse,
  CurrentUserResponseData,
  LoginCredentials,
  LoginResponseData,
  RegisterData,
} from "./types";

export const authApi = {
  async register(userData: RegisterData): Promise<AuthResponse> {
    await backendRequest<unknown>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        name: `${userData.first_name} ${userData.last_name}`,
        phone_number: null,
        location: null,
      }),
    });

    const loginResponse = await this.login({
      email: userData.email,
      password: userData.password,
    });

    return loginResponse;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await backendRequest<LoginResponseData>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    const data = response.data;
    const token = data.token;

    if (token) {
      localStorage.setItem("access_token", token);
    }

    return {
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: data.id,
          pid: data.pid,
          email: data.email || credentials.email,
          first_name: data.name?.split(" ")[0] || "",
          last_name: data.name?.split(" ")[1] || "",
          role: data.role || "user",
          is_verified: data.is_verified,
          created_at: new Date().toISOString(),
        },
        access_token: token,
        token_type: "Bearer",
      },
    };
  },

  async logout(): Promise<{ success: boolean; message: string; data: null }> {
    localStorage.removeItem("access_token");
    // Clear identity keys older builds used to cache; nothing reads them now.
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    return { success: true, message: "Logged out", data: null };
  },

  async getCurrentUser(): Promise<CurrentUserResponse> {
    const response = await backendRequest<CurrentUserResponseData>("/auth/current");

    // Role and verification state come from the server on every check. They
    // used to be read back out of localStorage, which any user can edit.
    return {
      success: true,
      message: "Success",
      data: {
        id: response.data.id,
        pid: response.data.pid,
        email: response.data.email,
        first_name: response.data.name?.split(" ")[0] || "",
        last_name: response.data.name?.split(" ")[1] || "",
        role: response.data.role || "user",
        is_verified: response.data.is_verified,
        created_at: new Date().toISOString(),
      },
    };
  },
};
