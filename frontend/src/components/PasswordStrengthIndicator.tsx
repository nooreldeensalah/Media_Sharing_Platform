import React from "react";
import { PasswordStrength } from "../types";
import { PasswordStrengthIndicatorProps } from "../types";

const requirements = [
  { key: "hasUpper", label: "One uppercase letter" },
  { key: "hasLower", label: "One lowercase letter" },
  { key: "hasNumber", label: "One number" },
  { key: "hasSpecial", label: "One special character" },
  { key: "hasLength", label: "At least 8 characters" },
] as const;

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  strength,
}) => {
  const strengthBars = Object.values(strength);

  return (
    <div
      className="mb-4"
      role="status"
      aria-label="Password strength indicator"
    >
      <div className="grid grid-cols-5 gap-1 mb-2">
        {strengthBars.map((passed, index) => (
          <div
            key={`strength-bar-${index}`}
            className={`h-1 rounded transition-colors duration-200 ${
              passed ? "bg-green-500" : "bg-gray-200"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
      <ul
        className="text-xs text-gray-600 space-y-1"
        aria-label="Password requirements"
      >
        {requirements.map(({ key, label }) => (
          <li
            key={key}
            className={`transition-colors duration-200 ${
              strength[key as keyof PasswordStrength] ? "text-green-500" : ""
            }`}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;
