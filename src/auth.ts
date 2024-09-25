import { Session } from "./session";

export interface Auth {
  signIn: (user: Record<string, any>) => Promise<void>;
  signOut: () => Promise<void>;
  isLoggedIn: () => boolean;
  getUser: () => Record<string, any> | undefined;
}

export function getAuth(session: Session): Auth {
  return {
    signIn: async (user: Record<string, any>): Promise<void> => {
      await session.set("_auth_user", user);
      session.regenerate(); // Regenerate session to ensure security
    },
    signOut: async (): Promise<void> => {
      session.forget("_auth_user"); // Remove user info
      session.regenerate(); // Regenerate session
    },
    isLoggedIn: (): boolean => {
      return !!session.get("_auth_user"); // Return true if 'user' exists
    },
    getUser: (): Record<string, any> | undefined => {
      return session.get("_auth_user"); // Return user info or undefined
    },
  };
}
