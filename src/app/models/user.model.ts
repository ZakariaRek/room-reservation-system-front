// src/app/models/user.model.ts
export interface User {
  id: number;
  username: string;
  email: string;
  roles?: string[];
  password?: string; // Optional, used only for create operations
}