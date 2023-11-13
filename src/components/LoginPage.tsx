import React, { ChangeEvent, useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [enteredName, setEnteredName] = useState<string>("");
  const navigate = useNavigate();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEnteredName(event.target.value);
  };

  const handleLogin = () => {
    if (!!enteredName && enteredName.length > 3) {
      login(enteredName);
      navigate("file-list");
    } else {
      alert("Username is required and should be longer than 3 characters!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <h4>Please enter your name</h4>
      <div style={{ width: "300px" }}>
        <Input
          className="min-w-0"
          type="text"
          placeholder="Your name"
          required={true}
          onChange={handleInputChange}
        />
        <Button type="submit" onClick={handleLogin} style={{ marginTop: "16px" }}>
          Log in
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
