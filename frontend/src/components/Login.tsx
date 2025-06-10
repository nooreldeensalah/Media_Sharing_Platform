import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { loginUser } from "../api";
import { toast } from "react-toastify";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { LoginProps } from "../types";

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = t("validation.usernameRequired");
    }

    if (!password) {
      newErrors.password = t("validation.passwordRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { token } = await loginUser(username, password);
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      toast.success(t("auth.welcome", { username }));
      navigate("/");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full mb-4"
          >
            <UserIcon className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t("auth.login")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t("auth.loginSubtitle")}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            type="text"
            placeholder={t("auth.username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
            icon={<UserIcon className="h-5 w-5" />}
            autoComplete="username"
            required
          />

          <Input
            type="password"
            placeholder={t("auth.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            icon={<LockClosedIcon className="h-5 w-5" />}
            autoComplete="current-password"
            required
          />

          <Button
            type="submit"
            loading={isLoading}
            className="w-full"
            size="lg"
          >
            {t("auth.loginButton")}
          </Button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400">
            {t("auth.notRegistered")}{" "}
            <Link
              to="/register"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200"
            >
              {t("auth.registerHere")}
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
