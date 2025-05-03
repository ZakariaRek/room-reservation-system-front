export interface User {
    id: number;
    username: string;
    email: string;
    fullName?: string;
    created?: string;
    lastLogin?: string | null;
    status?: string;
    roles: string[];
    department?: string;
    position?: string;
    verified?: boolean;
    activity?: number;
  }