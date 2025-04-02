import React, { createContext, useState, useContext, ReactNode } from "react";
import { LoginResponse } from "../navigation/types";

type AuthContextType = {
  userData: LoginResponse | null;
  setUserData: React.Dispatch<React.SetStateAction<LoginResponse | null>>;
  currentUserName: string | null;
  setCurrentUserName: React.Dispatch<React.SetStateAction<string | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<LoginResponse | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{ userData, setUserData, currentUserName, setCurrentUserName }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
