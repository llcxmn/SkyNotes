import { useState } from "react";
import LayoutAuth from "../components/LayoutAuth";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = () => {
  setIsLogin(!isLogin);
    };


  return (
    <LayoutAuth>
      {isLogin ? (
        <LoginForm onSwitchForm={handleToggle} />
      ) : (
        <RegisterForm onSwitchForm={handleToggle} />
      )}
    </LayoutAuth>
  );
}
