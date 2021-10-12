import React, { useCallback, useContext, useMemo } from "react";
import { createContext, useEffect, useState } from "react";
import { LoginForm } from "./login-form";

export interface User {
  name: string;
  id: number;
  code: string;
  username: string;
}

export interface IAuthContext {
  User?: User;
  Error?: string | null;
  isLoggedIn?: boolean;
  Login?: (username: string, password: string) => Promise<User>;
  Logout?: () => void;
}

type Props = {};

const AuthContext = createContext<IAuthContext>({} as IAuthContext);
const showToast = (msg: any) => {
  console.log(msg);
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [state, _setstate] = useState<IAuthContext>({});
  const updateState = useCallback(
    (nwState: Partial<IAuthContext>) => {
      _setstate((prev) => {
        return { ...prev, ...nwState };
      });
    },
    [_setstate]
  );
  useEffect(() => {}, []);
  const handleLoginSuccssed = useCallback(
    () => {
      console.log("login");
      let u: User = {
        name: "username",
        username: "username",
        id: 1,
        code: "username",
      };
      updateState({ User: u, isLoggedIn: true });
      return u;
    },
    [updateState]
  );
  const handleLoginFailed= useCallback(
    () => {
      alert("login error")
    },
    [updateState]
  );
  const ctxValue = useMemo(() => {
    let va: IAuthContext = {
      ...state,
    };
    return va;
  }, [state]);
  if (!state.isLoggedIn) {
    return <LoginForm onLoginSuccsed={handleLoginSuccssed} onLoginFailed={handleLoginFailed}  />;
  }
  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
};

export const AuthContainer: React.FC = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export const useAuth = () => useContext(AuthContext);
