import { useTranslation } from "react-i18next";

export function useRelativeTime() {
  const { t, i18n } = useTranslation();

  return (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return t("general.justNow");
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return t("general.minutesAgo", { count: minutes });
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return t("general.hoursAgo", { count: hours });
    }
    if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return t("general.daysAgo", { count: days });
    }

    // For older dates, use localized date format
    return new Date(dateString).toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
}
