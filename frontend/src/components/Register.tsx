import React, { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { UserPlusIcon, UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { registerUser } from "../api";
import { toast } from "react-toastify";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import { checkPasswordStrength } from "../utils/passwordUtils";
import { useDebounce } from "../hooks/useDebounce";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string; confirmPassword?: string }>({});
  const navigate = useNavigate();
  const { t } = useTranslation();

  const debouncedPassword = useDebounce(password, 300);
  const debouncedConfirmPassword = useDebounce(confirmPassword, 300);

  const passwordStrength = checkPasswordStrength(password);
  const isPasswordValid = password && passwordStrength.score >= 3;
  const passwordsMatch = password === confirmPassword && password !== "";

  const showPasswordMismatch = debouncedConfirmPassword && debouncedPassword &&
    debouncedPassword !== debouncedConfirmPassword;

  const validateForm = () => {
    const newErrors: { username?: string; password?: string; confirmPassword?: string } = {};

    if (!username.trim()) {
      newErrors.username = t('validation.usernameRequired');
    } else if (username.length < 3) {
      newErrors.username = t('validation.usernameMinLength');
    }

    if (!password) {
      newErrors.password = t('validation.passwordRequired');
    } else if (passwordStrength.score < 3) {
      newErrors.password = t('validation.passwordWeak');
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('validation.confirmPasswordRequired');
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('validation.passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await registerUser(username, password);
      toast.success(t('auth.registerSuccess'));
      navigate("/login");
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
            <UserPlusIcon className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('auth.register')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('auth.registerSubtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            placeholder={t('auth.username')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
            icon={<UserIcon className="h-5 w-5" />}
            autoComplete="username"
            required
          />

          <div className="space-y-2">
            <Input
              type="password"
              placeholder={t('auth.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<LockClosedIcon className="h-5 w-5" />}
              autoComplete="new-password"
              required
            />
            {password && (
              <PasswordStrengthIndicator strength={passwordStrength} />
            )}
          </div>

          <Input
            type="password"
            placeholder={t('auth.confirmPassword')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword || (showPasswordMismatch ? t('validation.passwordMismatch') : undefined)}
            icon={<LockClosedIcon className="h-5 w-5" />}
            autoComplete="new-password"
            required
          />

          <Button
            type="submit"
            loading={isLoading}
            disabled={!isPasswordValid || !passwordsMatch || !username}
            className="w-full"
            size="lg"
          >
            {t('auth.registerButton')}
          </Button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400">
            {t('auth.alreadyRegistered')}{" "}
            <Link
              to="/login"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200"
            >
              {t('auth.loginHere')}
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
