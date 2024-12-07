//Todo Make user interface
//Make Autenticated user interface

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserSession {
  isAuthenticated: boolean;
  user?: User;
}
