import React, { createContext, useState, useContext, ReactNode } from "react";

type AuthContextType = {
  userData: { authToken: string; accountId: string } | null;
  setUserData: React.Dispatch<
    React.SetStateAction<{ authToken: string; accountId: string } | null>
  >;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<AuthContextType["userData"]>(null);

  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
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
