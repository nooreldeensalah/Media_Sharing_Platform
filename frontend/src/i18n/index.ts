import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.title': 'Media Sharing Platform',
      'nav.subtitle': 'Upload and explore your media files with ease',
      'nav.logout': 'Logout',

      // Authentication
      'auth.login': 'Login',
      'auth.register': 'Register',
      'auth.username': 'Username',
      'auth.password': 'Password',
      'auth.confirmPassword': 'Confirm Password',
      'auth.loginButton': 'Sign In',
      'auth.registerButton': 'Create Account',
      'auth.notRegistered': 'Not registered?',
      'auth.registerHere': 'Register here',
      'auth.alreadyRegistered': 'Already have an account?',
      'auth.loginHere': 'Login here',
      'auth.welcome': 'Welcome {{username}}!',
      'auth.registerSuccess': 'Registration successful! Please log in.',
      'auth.loginSubtitle': 'Welcome back! Please sign in to your account.',
      'auth.registerSubtitle': 'Create your account to get started.',

      // Media
      'media.gallery': 'Media Gallery',
      'media.upload': 'Upload Media',
      'media.uploading': 'Uploading...',
      'media.uploadSuccess': 'Media uploaded successfully!',
      'media.uploadFailed': 'File upload failed',
      'media.likes': 'likes',
      'media.uploadedBy': 'Uploaded by',
      'media.uploadedOn': 'Uploaded on',
      'media.delete': 'Delete',
      'media.confirmDelete': 'Confirm Deletion',
      'media.deleteMessage': 'Are you sure you want to delete this media item?',
      'media.cancel': 'Cancel',
      'media.noMedia': 'No media files found',

      // Pagination
      'pagination.previous': 'Previous',
      'pagination.next': 'Next',
      'pagination.page': 'Page {{current}} of {{total}}',
      'pagination.showing': 'Showing {{start}} to {{end}} of {{total}} items',

      // Media Card
      'media.failedToLoad': 'Failed to load image',

      // General
      'general.loading': 'Loading...',
      'general.error': 'An error occurred',
      'general.retry': 'Retry',
      'general.close': 'Close',
      'general.save': 'Save',
      'general.scrollToTop': 'Scroll to top',
      'general.justNow': 'Just now',
      'general.open': 'Open',
      'general.minutesAgo': '{{count}}m ago',
      'general.hoursAgo': '{{count}}h ago',
      'general.daysAgo': '{{count}}d ago',

      // Password Strength
      'password.strength': 'Password Strength',
      'password.requirements': 'Requirements:',
      'password.veryWeak': 'Very Weak',
      'password.weak': 'Weak',
      'password.fair': 'Fair',
      'password.good': 'Good',
      'password.strong': 'Strong',
      'password.requirement.length': 'At least 8 characters',
      'password.requirement.upper': 'One uppercase letter (A-Z)',
      'password.requirement.lower': 'One lowercase letter (a-z)',
      'password.requirement.number': 'One number (0-9)',
      'password.requirement.special': 'One special character (!@#$%^&*)',

      // Upload
      'upload.dragDrop': 'Drag and drop your images or videos, or click to browse',
      'upload.dropHere': 'Drop your files here',
      'upload.chooseFiles': 'Choose Files',
      'upload.maxSize': 'Maximum file size: 50MB. Supported formats: JPEG, PNG, GIF, MP4, WebM',
      'upload.images': 'Images',
      'upload.videos': 'Videos',

      // Validation Messages
      'validation.usernameRequired': 'Username is required',
      'validation.usernameMinLength': 'Username must be at least 3 characters',
      'validation.passwordRequired': 'Password is required',
      'validation.passwordWeak': 'Password is too weak',
      'validation.confirmPasswordRequired': 'Please confirm your password',
      'validation.passwordMismatch': 'Passwords do not match',
      'validation.invalidFileType': 'Please select an image or video file',
      'validation.fileSizeLimit': 'File size must be less than 50MB',

      // Media List
      'media.startUploading': 'Start by uploading your first media file!',

      // Accessibility
      'a11y.skipToContent': 'Skip to main content',
      'a11y.toggleTheme': 'Toggle dark mode',
      'a11y.likeButton': 'Like this media item',
      'a11y.unlikeButton': 'Unlike this media item',
      'a11y.deleteButton': 'Delete this media item',
      'a11y.uploadButton': 'Upload new media file',
      'a11y.mediaImage': 'Media image: {{filename}}',
      'a11y.mediaVideo': 'Media video: {{filename}}',
      'a11y.openInNewTab': 'Open media in new tab',
    }
  },
  ar: {
    translation: {
      // Navigation
      'nav.title': 'منصة مشاركة الوسائط',
      'nav.subtitle': 'ارفع واستكشف ملفاتك الوسائطية بسهولة',
      'nav.logout': 'تسجيل الخروج',

      // Authentication
      'auth.login': 'تسجيل الدخول',
      'auth.register': 'إنشاء حساب',
      'auth.username': 'اسم المستخدم',
      'auth.password': 'كلمة المرور',
      'auth.confirmPassword': 'تأكيد كلمة المرور',
      'auth.loginButton': 'دخول',
      'auth.registerButton': 'إنشاء حساب',
      'auth.notRegistered': 'لا تملك حساباً؟',
      'auth.registerHere': 'سجل هنا',
      'auth.alreadyRegistered': 'لديك حساب بالفعل؟',
      'auth.loginHere': 'سجل دخولك هنا',
      'auth.welcome': 'مرحباً {{username}}!',
      'auth.registerSuccess': 'تم التسجيل بنجاح! يرجى تسجيل الدخول.',
      'auth.loginSubtitle': 'مرحباً بعودتك! يرجى تسجيل الدخول إلى حسابك.',
      'auth.registerSubtitle': 'أنشئ حسابك للبدء.',

      // Media
      'media.gallery': 'معرض الوسائط',
      'media.upload': 'رفع ملف',
      'media.uploading': 'جاري الرفع...',
      'media.uploadSuccess': 'تم رفع الملف بنجاح!',
      'media.uploadFailed': 'فشل في رفع الملف',
      'media.likes': 'إعجاب',
      'media.uploadedBy': 'رفع بواسطة',
      'media.uploadedOn': 'رفع في',
      'media.delete': 'حذف',
      'media.confirmDelete': 'تأكيد الحذف',
      'media.deleteMessage': 'هل أنت متأكد من حذف هذا الملف؟',
      'media.cancel': 'إلغاء',
      'media.noMedia': 'لم يتم العثور على ملفات وسائط',

      // Pagination
      'pagination.previous': 'السابق',
      'pagination.next': 'التالي',
      'pagination.page': 'صفحة {{current}} من {{total}}',
      'pagination.showing': 'عرض {{start}} إلى {{end}} من {{total}} عنصر',

      // Media Card
      'media.failedToLoad': 'فشل في تحميل الصورة',

      // General
      'general.loading': 'جاري التحميل...',
      'general.error': 'حدث خطأ',
      'general.retry': 'إعادة المحاولة',
      'general.close': 'إغلاق',
      'general.save': 'حفظ',
      'general.scrollToTop': 'العودة إلى الأعلى',
      'general.justNow': 'الآن',
      'general.open': 'فتح',
      'general.minutesAgo': 'منذ {{count}} دقيقة',
      'general.hoursAgo': 'منذ {{count}} ساعة',
      'general.daysAgo': 'منذ {{count}} يوم',

      // Password Strength
      'password.strength': 'قوة كلمة المرور',
      'password.requirements': 'المتطلبات:',
      'password.veryWeak': 'ضعيفة جداً',
      'password.weak': 'ضعيفة',
      'password.fair': 'مقبولة',
      'password.good': 'جيدة',
      'password.strong': 'قوية',
      'password.requirement.length': 'على الأقل 8 أحرف',
      'password.requirement.upper': 'حرف كبير واحد (A-Z)',
      'password.requirement.lower': 'حرف صغير واحد (a-z)',
      'password.requirement.number': 'رقم واحد (0-9)',
      'password.requirement.special': 'رمز خاص واحد (!@#$%^&*)',

      // Upload
      'upload.dragDrop': 'اسحب وأفلت صورك أو فيديوهاتك، أو انقر للتصفح',
      'upload.dropHere': 'أفلت ملفاتك هنا',
      'upload.chooseFiles': 'اختر الملفات',
      'upload.maxSize': 'الحد الأقصى لحجم الملف: 50 ميجابايت. الصيغ المدعومة: JPEG, PNG, GIF, MP4, WebM',
      'upload.images': 'الصور',
      'upload.videos': 'الفيديوهات',

      // Validation Messages
      'validation.usernameRequired': 'اسم المستخدم مطلوب',
      'validation.usernameMinLength': 'اسم المستخدم يجب أن يكون على الأقل 3 أحرف',
      'validation.passwordRequired': 'كلمة المرور مطلوبة',
      'validation.passwordWeak': 'كلمة المرور ضعيفة جداً',
      'validation.confirmPasswordRequired': 'يرجى تأكيد كلمة المرور',
      'validation.passwordMismatch': 'كلمات المرور غير متطابقة',
      'validation.invalidFileType': 'يرجى اختيار ملف صورة أو فيديو',
      'validation.fileSizeLimit': 'حجم الملف يجب أن يكون أقل من 50 ميجابايت',

      // Media List
      'media.startUploading': 'ابدأ برفع أول ملف وسائطي!',

      // Accessibility
      'a11y.skipToContent': 'انتقل إلى المحتوى الرئيسي',
      'a11y.toggleTheme': 'تبديل الوضع المظلم',
      'a11y.likeButton': 'أعجبني هذا الملف',
      'a11y.unlikeButton': 'إلغاء الإعجاب',
      'a11y.deleteButton': 'حذف هذا الملف',
      'a11y.uploadButton': 'رفع ملف جديد',
      'a11y.mediaImage': 'صورة: {{filename}}',
      'a11y.mediaVideo': 'فيديو: {{filename}}',
      'a11y.openInNewTab': 'فتح الوسائط في علامة تبويب جديدة',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

// Handle RTL languages
i18n.on('languageChanged', (lng) => {
  const isRTL = lng === 'ar';
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

// Set initial direction
const currentLang = i18n.language || 'en';
document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = currentLang;

export default i18n;
