import React from "react";
import { PasswordStrength } from "../types";
import { PasswordStrengthIndicatorProps } from "../types";

interface Requirement {
  key: keyof PasswordStrength;
  label: string;
  icon: string;
}

const requirements: Requirement[] = [
  { key: "hasLength", label: "At least 8 characters", icon: "📏" },
  { key: "hasUpper", label: "One uppercase letter (A-Z)", icon: "🔤" },
  { key: "hasLower", label: "One lowercase letter (a-z)", icon: "🔡" },
  { key: "hasNumber", label: "One number (0-9)", icon: "🔢" },
  { key: "hasSpecial", label: "One special character (!@#$%^&*)", icon: "⚡" },
];

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  strength,
}) => {
  const metRequirements = Object.values(strength).filter(Boolean).length;

  const getStrengthLevel = () => {
    if (metRequirements === 0) return { label: "Very Weak", color: "bg-red-500", textColor: "text-red-600", widthClass: "w-0" };
    if (metRequirements <= 2) return { label: "Weak", color: "bg-red-400", textColor: "text-red-600", widthClass: "w-2/5" };
    if (metRequirements <= 3) return { label: "Fair", color: "bg-yellow-400", textColor: "text-yellow-600", widthClass: "w-3/5" };
    if (metRequirements <= 4) return { label: "Good", color: "bg-blue-500", textColor: "text-blue-600", widthClass: "w-4/5" };
    return { label: "Strong", color: "bg-green-500", textColor: "text-green-600", widthClass: "w-full" };
  };

  const strengthLevel = getStrengthLevel();

  return (
    <div className="mb-4 space-y-3">
      {/* Strength meter */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Password Strength</span>
          <span className={`text-sm font-semibold ${strengthLevel.textColor}`}>
            {strengthLevel.label}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${strengthLevel.color} ${strengthLevel.widthClass}`}
            role="progressbar"
            aria-label={`Password strength: ${strengthLevel.label}`}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Requirements:</h4>
        <div className="grid gap-2">
          {requirements.map(({ key, label, icon }) => {
            const isMet = strength[key];
            return (
              <div
                key={key}
                className={`flex items-center space-x-2 text-xs transition-all duration-300 ${
                  isMet ? "text-green-600" : "text-gray-500"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-5 h-5 rounded-full transition-all duration-300 ${
                    isMet
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isMet ? "✓" : icon}
                </div>
                <span className={`${isMet ? "line-through" : ""}`}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
