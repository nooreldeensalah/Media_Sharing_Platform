import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Language persistence key
const LANGUAGE_KEY = "@app_language";

// Get stored language or fallback to device locale
const getStoredLanguage = async (): Promise<string> => {
  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (storedLanguage) {
      return storedLanguage;
    }
  } catch (error) {
    console.warn("Failed to get stored language:", error);
  }

  // Fallback to device locale
  return Localization.getLocales()[0]?.languageCode || "en";
};

// Store language preference
export const storeLanguage = async (language: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.warn("Failed to store language:", error);
  }
};

const resources = {
  en: {
    translation: {
      // Navigation
      home: "Home",
      login: "Login",
      register: "Register",
      logout: "Logout",

      // Authentication
      email: "Email/Username",
      password: "Password",
      confirmPassword: "Confirm Password",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Enter your password",
      confirmPasswordPlaceholder: "Confirm your password",
      loginButton: "Login",
      registerButton: "Register",
      loginTitle: "Welcome Back",
      registerTitle: "Create Account",
      loginSubtitle: "Sign in to your account",
      registerSubtitle: "Join us today",
      welcomeBack: "Welcome back!",
      noAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      loggedOutSuccessfully: "Logged out successfully",
      logoutFailed: "Failed to logout",
      accountCreatedSuccessfully: "Account created successfully!",

      // Media
      upload: "Upload",
      selectMedia: "Select Media",
      uploadSuccess: "Media uploaded successfully",
      uploadError: "Failed to upload media",
      uploadFailedToStart: "Upload failed to start",
      likeUpdateFailed: "Failed to update like status",
      deleteMediaFailed: "Failed to delete media",
      shareFailed: "Failed to share media",
      deleteConfirm:
        "Are you sure you want to delete this media? This action cannot be undone.",
      delete: "Delete",
      cancel: "Cancel",

      // Media specific
      media: {
        uploadSuccess: "Media uploaded successfully",
        uploadFailed: "Failed to upload media",
        uploading: "Uploading...",
        uploadInProgress: "Please wait while your file is being uploaded",
        videoUploadWait: "Please wait, videos may take longer to upload...",
      },
      uploadingImage: "Uploading image...",
      uploadingVideo: "Uploading video...",
      mediaDeletedSuccessfully: "Media deleted successfully",

      // Validation Messages
      validation: {
        invalidFileType: "Please select an image or video file",
        fileSizeLimit: "File size must be less than 50MB",
      },

      // Permissions
      permission: {
        required: "Permission Required",
        photoLibrary: "We need access to your photos to upload media.",
      },

      // Search and Filter
      search: "Search...",
      searchPlaceholder: "Search media...",
      filterBy: "Filter by",
      allUsers: "All Users",
      myMedia: "My Media",

      // General
      loading: "Loading...",
      error: "Error",
      success: "Success",
      retry: "Retry",
      save: "Save",
      today: "today",
      yesterday: "yesterday",
      justNow: "just now",
      noMediaFound: "No Media Available - Start Uploading!",

      // Pagination
      showingItems: "Showing {{start}} to {{end}} of {{total}} items",
      goToPage: "Go to page {{page}}",
      previousPage: "Previous page",
      nextPage: "Next page",
      item: "item",
      items: "items",

      // Relative time
      minutesAgo_one: "{{count}}m ago",
      minutesAgo_other: "{{count}}m ago",
      hoursAgo_one: "{{count}}h ago",
      hoursAgo_other: "{{count}}h ago",
      daysAgo_one: "{{count}}d ago",
      daysAgo_other: "{{count}}d ago",
      weeksAgo_one: "{{count}}w ago",
      weeksAgo_other: "{{count}}w ago",

      // Password Strength
      passwordWeak: "Weak",
      passwordMedium: "Medium",
      passwordStrong: "Strong",
      passwordVeryStrong: "Very Strong",
      passwordRequirements: "Password must be at least 8 characters long",

      // Theme
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      system: "System",

      // Language
      language: "Language",

      // Accessibility
      skipToContent: "Skip to content",
      toggleTheme: "Toggle theme",
      toggleLanguage: "Toggle language",
    },
  },
  ar: {
    translation: {
      // Navigation
      home: "الرئيسية",
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      logout: "تسجيل الخروج",

      // Authentication
      email: "البريد الإلكتروني/اسم المستخدم",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      passwordPlaceholder: "أدخل كلمة المرور",
      confirmPasswordPlaceholder: "تأكيد كلمة المرور",
      loginButton: "تسجيل الدخول",
      registerButton: "إنشاء حساب",
      loginTitle: "مرحبًا بعودتك",
      registerTitle: "إنشاء حساب جديد",
      loginSubtitle: "قم بتسجيل الدخول إلى حسابك",
      registerSubtitle: "انضم إلينا اليوم",
      welcomeBack: "مرحبًا بعودتك!",
      noAccount: "ليس لديك حساب؟",
      alreadyHaveAccount: "هل لديك حساب بالفعل؟",
      loggedOutSuccessfully: "تم تسجيل الخروج بنجاح",
      logoutFailed: "فشل في تسجيل الخروج",
      accountCreatedSuccessfully: "تم إنشاء الحساب بنجاح!",

      // Media
      upload: "رفع",
      selectMedia: "اختر وسائط",
      uploadSuccess: "تم رفع الوسائط بنجاح",
      uploadError: "فشل في رفع الوسائط",
      uploadFailedToStart: "فشل في بدء الرفع",
      likeUpdateFailed: "فشل في تحديث حالة الإعجاب",
      deleteMediaFailed: "فشل في حذف الوسائط",
      shareFailed: "فشل في مشاركة الوسائط",
      deleteConfirm:
        "هل أنت متأكد من حذف هذه الوسائط؟ لا يمكن التراجع عن هذا الإجراء.",
      delete: "حذف",
      cancel: "إلغاء",

      // Media specific
      media: {
        uploadSuccess: "تم رفع الوسائط بنجاح",
        uploadFailed: "فشل في رفع الوسائط",
        uploading: "جاري الرفع...",
        uploadInProgress: "يرجى الانتظار أثناء رفع الملف",
        videoUploadWait:
          "يرجى الانتظار، قد تستغرق مقاطع الفيديو وقتاً أطول للرفع...",
      },
      uploadingImage: "جاري رفع الصورة...",
      uploadingVideo: "جاري رفع الفيديو...",
      mediaDeletedSuccessfully: "تم حذف الوسائط بنجاح",

      // Validation Messages
      validation: {
        invalidFileType: "يرجى اختيار ملف صورة أو فيديو",
        fileSizeLimit: "يجب أن يكون حجم الملف أقل من 50 ميغابايت",
      },

      // Permissions
      permission: {
        required: "إذن مطلوب",
        photoLibrary: "نحتاج إلى الوصول إلى صورك لرفع الوسائط.",
      },

      // Search and Filter
      search: "بحث...",
      searchPlaceholder: "ابحث في الوسائط...",
      filterBy: "تصفية حسب",
      allUsers: "جميع المستخدمين",
      myMedia: "وسائطي",

      // General
      loading: "جاري التحميل...",
      error: "خطأ",
      success: "نجح",
      retry: "إعادة المحاولة",
      save: "حفظ",
      today: "اليوم",
      yesterday: "أمس",
      justNow: "الآن",
      noMediaFound: "لا توجد وسائط متاحة - ابدأ بالرفع!",

      // Pagination
      showingItems: "عرض {{start}} إلى {{end}} من {{total}} عنصر",
      goToPage: "انتقل إلى الصفحة {{page}}",
      previousPage: "الصفحة السابقة",
      nextPage: "الصفحة التالية",
      item: "عنصر",
      items: "عناصر",

      // Relative time
      minutesAgo_zero: "منذ {{count}} دقائق",
      minutesAgo_one: "منذ دقيقة واحدة",
      minutesAgo_two: "منذ دقيقتين",
      minutesAgo_few: "منذ {{count}} دقائق",
      minutesAgo_many: "منذ {{count}} دقيقة",
      minutesAgo_other: "منذ {{count}} دقيقة",
      hoursAgo_zero: "منذ {{count}} ساعات",
      hoursAgo_one: "منذ ساعة واحدة",
      hoursAgo_two: "منذ ساعتين",
      hoursAgo_few: "منذ {{count}} ساعات",
      hoursAgo_many: "منذ {{count}} ساعة",
      hoursAgo_other: "منذ {{count}} ساعة",
      daysAgo_zero: "منذ {{count}} أيام",
      daysAgo_one: "منذ يوم واحد",
      daysAgo_two: "منذ يومين",
      daysAgo_few: "منذ {{count}} أيام",
      daysAgo_many: "منذ {{count}} يومًا",
      daysAgo_other: "منذ {{count}} يوم",
      weeksAgo_zero: "منذ {{count}} أسابيع",
      weeksAgo_one: "منذ أسبوع واحد",
      weeksAgo_two: "منذ أسبوعين",
      weeksAgo_few: "منذ {{count}} أسابيع",
      weeksAgo_many: "منذ {{count}} أسبوعًا",
      weeksAgo_other: "منذ {{count}} أسبوع",

      // Password Strength
      passwordWeak: "ضعيفة",
      passwordMedium: "متوسطة",
      passwordStrong: "قوية",
      passwordVeryStrong: "قوية جداً",
      passwordRequirements: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",

      // Theme
      theme: "المظهر",
      light: "فاتح",
      dark: "داكن",
      system: "النظام",

      // Language
      language: "اللغة",

      // Accessibility
      skipToContent: "انتقل إلى المحتوى",
      toggleTheme: "تبديل المظهر",
      toggleLanguage: "تبديل اللغة",
    },
  },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources,
  lng: "en", // Will be updated after initialization
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

// Initialize with stored language
const initializeLanguage = async () => {
  const storedLanguage = await getStoredLanguage();
  await i18n.changeLanguage(storedLanguage);
};

// Call initialization
initializeLanguage();

export default i18n;
