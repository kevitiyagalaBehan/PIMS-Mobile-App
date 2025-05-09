import React, { createContext, useState, useContext } from "react";
import { LoginResponse, AuthContextType, AuthProviderProps } from "../navigation/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<LoginResponse | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [currentAccountName, setCurrentAccountName] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{ userData, setUserData, currentUserName, setCurrentUserName, currentAccountName, setCurrentAccountName }}
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
