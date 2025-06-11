import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { getColors } from "../../constants/Colors";
import { useTranslation } from "react-i18next";
import { storeLanguage } from "../../i18n";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇪🇬" },
];

export const LanguageSelector: React.FC = () => {
  const { colorScheme } = useTheme();
  const colors = getColors(colorScheme);
  const { i18n, t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const changeLanguage = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      await storeLanguage(languageCode);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const renderLanguageItem = ({ item }: { item: Language }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
        item.code === i18n.language && {
          backgroundColor: colors.primary + "20",
        },
      ]}
      onPress={() => changeLanguage(item.code)}
      accessibilityLabel={`Select ${item.name} language`}
      accessibilityRole="button"
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <View style={styles.languageInfo}>
        <Text style={[styles.languageName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.nativeName, { color: colors.textSecondary }]}>
          {item.nativeName}
        </Text>
      </View>
      {item.code === i18n.language && (
        <Ionicons name="checkmark" size={20} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        onPress={() => setIsModalVisible(true)}
        accessibilityLabel={t("toggleLanguage")}
        accessibilityRole="button"
        accessibilityHint="Opens language selection menu"
      >
        <Text style={styles.flag}>{currentLanguage.flag}</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[styles.modalHeader, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t("language")}
              </Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                accessibilityLabel="Close language selector"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
              style={styles.languageList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
  },
  flag: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 300,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  languageList: {
    maxHeight: 200,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  languageInfo: {
    flex: 1,
    marginLeft: 12,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "500",
  },
  nativeName: {
    fontSize: 14,
    marginTop: 2,
  },
});
