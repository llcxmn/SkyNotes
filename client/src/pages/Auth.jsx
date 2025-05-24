import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import LayoutAuth from "../components/LayoutAuth";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    // Check URL params first
    const formParam = searchParams.get("form");
    if (formParam === "register") {
      setIsLogin(false);
      return;
    } else if (formParam === "login") {
      setIsLogin(true);
      return;
    }

    // Fall back to location state if no URL param
    if (location.state?.form === 'register') {
      setIsLogin(false);
    } else if (location.state?.form === 'login') {
      setIsLogin(true);
    }
  }, [searchParams, location.state]);

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