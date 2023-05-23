import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  ar: {
    translation: {
      "Welcome message": "مرحبًا بكم في DZ-Archive",
      "Project Overview": "نظرة عامة",
      "Drag and drop zone":
        "قم بسحب الملفات وإسقاطها هنا ، أو انقر لتحديد الملفات للأرشفة.",
      "Add a file": "أضف ملفًا",
      Archiving: "أرشفة",
      Documentation: "دليل المستخدم",
      Digitize: "رقمنة",
      Browse: "تصفح",
      "Search placeholder":
        "ابحث عن طريق اسم الملف ، الوصف ، النص المستخرج ، الكلمات الرئيسية ...",
      Settings: "إعدادات",
      Tools: "أدوات",
      Warehouse: "مخزن",
      References: "مراجع",
      Files: "الملفات",
      Organization: "المؤسسة",
      Users: "المستخدمين",
      Slips: "جدول الدفع",
      Boxes: "العلب",
      Articles: "الملفات",
      Tags: "الكلمات الدلالية",
      Name: "الاسم",
      Email: "البريد الالكتروني",
      Role: "صفة المستخدم",
      Action: "",
      validate: "تفعيل الحساب",
      Validated: "مفعل",
      "Add Slip": "اضافة جدول دفع",
      "N Slip": "رقم جدول الدفع",
      service: "المصلحة",
      date: "تاريخ الدفع",
      "extreme date": "التاريخ الأقصى",
      entitled: "محتوى الدفع",
      Search: "بحث",
      "N Room": "رقم القاعة",
      Room: "رقم القاعة",
      "N box": "رقم علبة التخزين",
      Box: "رقم علبة التخزين",
      "N Floor": "رقم الطابق",
      shelving: "رقم الرف",
      Article: "رقم الملف",
      updatedAt: "تاريخ التعديل",
      Afficher: "عرض",
      "Add Tag": "اضافة كلمة دلالية",
      Delete: "مسح",
      "Search By Date": "البحث عن تاريخ",
      Logout: "خروج",
      Description: "وصف",
      EditInformation: "تعديل",
      Preview: "عرض",
      Activities: "أنشطة المستخدم",
      Activity: "نوع النشاط",
      User: "المستخدم",

      Communes: "البلديات",
      Directions: "المديريات",
    },
  },
  fr: {
    translation: {
      "Welcome message": "Bienvenue à DZ-Archive",
      "Project Overview": "Aperçu du projet",
      "Drag and drop zone":
        "Faites glisser et déposez les fichiers ici, ou cliquez pour sélectionner les fichiers à archiver.",
      "Add a file": "Ajouter un fichier",
      Archiving: "Archivage",
      Documentation: "Documentation",
      Digitize: "Numériser",
      Description: "Description",
      Browse: "Parcourir",
      "Search placeholder":
        "Recherche par nom de fichier, description, texte extrait, mots-clés...",
      Settings: "Paramètres",
      Tools: "Outils",
      Warehouse: "Entrepot",
      References: "Références",
      Files: "Fichiers",
      Organization: "Organisation",
      Users: "Utilisateurs",
      Slips: "Bordereaux de versement",
      Boxes: "Boîtes",
      Articles: "Articles",
      Tags: "Tags",
      Name: "Nom",
      Email: "Email",
      Role: "Role",
      Action: "Action",
      Validated: "Validé",
      "Add Slip": "Ajouter Bordereau de versement",
      "N Slip": "N Bordereau",
      service: "Service versant",
      date: "Date de versement",
      "extreme date": "Date Extrême",
      entitled: "Intitulé",
      Search: "Recherche",
      "N Room": "N Salle",
      Room: "Salle",
      "N box": "N Boîte",
      Box: "Boîte",
      "N Floor": "N Etage",
      shelving: "N Rayonnage",
      Article: "Article",
      updatedAt: "Date de modification",
      View: "Afficher",
      "Add Tag": "Ajouter un tag",
      Delete: "Supprimer",
      validate: "valider",
      "Search By Date": "Recherche par date",
      Logout: "Déconnecter",
      EditInformation: "Modification",
      Preview: "Aperçu",
      Activities: "Activités",
      Activity: "Activité",
      User: "Utilisateur",

      Communes: "Communes",
      Directions: "Directions",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "fr", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
