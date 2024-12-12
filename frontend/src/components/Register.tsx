import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import { toast } from "react-toastify";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import { checkPasswordStrength } from "../utils/passwordUtils";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const passwordStrength = checkPasswordStrength(password);
  const isPasswordValid =
    password && Object.values(passwordStrength).every(Boolean);
  const passwordsMatch = password === confirmPassword && password !== "";

  const handleRegister = async () => {
    try {
      await registerUser(username, password);
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <div className="relative">
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`w-full p-2 mb-1 border rounded ${
            confirmPassword && !passwordsMatch ? "border-red-500" : ""
          }`}
        />
        {confirmPassword && !passwordsMatch && (
          <p className="text-red-500 text-xs mb-4">Passwords do not match</p>
        )}
      </div>

      <PasswordStrengthIndicator strength={passwordStrength} />

      <button
        onClick={handleRegister}
        disabled={!isPasswordValid || !passwordsMatch || !username}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Register
      </button>
    </div>
  );
};

export default Register;
