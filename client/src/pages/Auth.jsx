import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import LayoutAuth from "../components/LayoutAuth";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const formType = searchParams.get("form");
    if (formType === "register") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [searchParams]);

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
