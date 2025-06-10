import React from "react";
import { useTranslation } from "react-i18next";
import { PasswordStrength } from "../types";
import { PasswordStrengthIndicatorProps } from "../types";

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  strength,
}) => {
  const { t } = useTranslation();

  const requirements = [
    {
      key: "hasLength" as keyof PasswordStrength,
      label: t("password.requirement.length"),
      icon: "📏",
    },
    {
      key: "hasUpper" as keyof PasswordStrength,
      label: t("password.requirement.upper"),
      icon: "🔤",
    },
    {
      key: "hasLower" as keyof PasswordStrength,
      label: t("password.requirement.lower"),
      icon: "🔡",
    },
    {
      key: "hasNumber" as keyof PasswordStrength,
      label: t("password.requirement.number"),
      icon: "🔢",
    },
    {
      key: "hasSpecial" as keyof PasswordStrength,
      label: t("password.requirement.special"),
      icon: "⚡",
    },
  ];

  const metRequirements = Object.values(strength).filter(Boolean).length;

  const getStrengthLevel = () => {
    if (metRequirements === 0)
      return {
        label: t("password.veryWeak"),
        color: "bg-red-500",
        textColor: "text-red-600 dark:text-red-400",
        widthClass: "w-0",
      };
    if (metRequirements <= 2)
      return {
        label: t("password.weak"),
        color: "bg-red-400",
        textColor: "text-red-600 dark:text-red-400",
        widthClass: "w-2/5",
      };
    if (metRequirements <= 3)
      return {
        label: t("password.fair"),
        color: "bg-yellow-400",
        textColor: "text-yellow-600 dark:text-yellow-400",
        widthClass: "w-3/5",
      };
    if (metRequirements <= 4)
      return {
        label: t("password.good"),
        color: "bg-blue-500",
        textColor: "text-blue-600 dark:text-blue-400",
        widthClass: "w-4/5",
      };
    return {
      label: t("password.strong"),
      color: "bg-green-500",
      textColor: "text-green-600 dark:text-green-400",
      widthClass: "w-full",
    };
  };

  const strengthLevel = getStrengthLevel();

  return (
    <div className="mb-4 space-y-3">
      {/* Strength meter */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("password.strength")}
          </span>
          <span className={`text-sm font-semibold ${strengthLevel.textColor}`}>
            {strengthLevel.label}
          </span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${strengthLevel.color} ${strengthLevel.widthClass}`}
            role="progressbar"
            aria-label={`${t("password.strength")}: ${strengthLevel.label}`}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("password.requirements")}
        </h4>
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
                      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {isMet ? "✓" : icon}
                </div>
                <span
                  className={`${isMet ? "line-through" : ""} text-gray-700 dark:text-gray-300`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
