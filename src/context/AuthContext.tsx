import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  username: "",
  login: (username: string) => {},
  logout: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();

  const login = (username: string) => {
    setUsername(username);
  };

  const logout = () => {
    setUsername("");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        username,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
