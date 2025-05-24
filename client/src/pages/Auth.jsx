import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LayoutAuth from "../components/LayoutAuth";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if navigation state contains form preference
    if (location.state?.form === 'register') {
      setIsLogin(false);
    } else if (location.state?.form === 'login') {
      setIsLogin(true);
    }
  }, [location.state]);

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