export interface AuthResponseData {
    idToken: string;
    localId: string;
    email: string;
    name: string;
    refreshToken: string;
    expiresIn: number;
    registered?: boolean;
  }