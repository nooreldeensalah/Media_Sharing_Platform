import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { ThemeToggle } from "./ui/ThemeToggle";
import { LanguageSelector } from "./ui/LanguageSelector";
import { Button } from "./ui/Button";
import { NavBarProps } from "../types";

const NavBar: React.FC<NavBarProps> = ({ isAuthenticated, handleLogout }) => {
  const { t } = useTranslation();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 mb-6 transition-colors duration-200"
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-3 rtl:space-x-reverse"
            whileHover={{ scale: 1.02 }}
          >
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg">
              <PhotoIcon className="h-8 w-8 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                {t('nav.title')}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                {t('nav.subtitle')}
              </p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <LanguageSelector />

            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                {t('nav.logout')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default NavBar;
