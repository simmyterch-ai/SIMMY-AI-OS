import type { Locale } from "./config";

export const translations = {
  en: {
    common: {
      dashboard: "Dashboard",
      employees: "Employees",
      departments: "Departments",
      teams: "Teams",
      attendance: "Attendance",
      reports: "Reports",
      settings: "Settings",
      organization: "Organization",
      aiAssistant: "AI Assistant",
      logout: "Logout",
      loading: "Loading...",
      viewAll: "View All",
      live: "Live",
      people: "People",
rolesPermissions: "Roles & Permissions",
menu: "Menu",
search: "Search anything...",
notifications: "Notifications",
theme: "Theme",
    },

    dashboard: {
      todaysOverview: "Today's Overview",
      realTimeSummary: "Real-time organization summary",
      recentActivity: "Recent Activity",
      latestActions: "Latest actions across your organization",
      employees: "Employees",
      present: "Present",
      late: "Late",
      onLeave: "On Leave",
      attendanceRate: "Attendance Rate",
      healthScore: "Health Score",
      organizationHealth: "Organization Health",
      sapAiSummary: "SAP AI Summary",
      noRecentActivities: "No recent activities.",
      excellentAttendance: "Excellent attendance today.",
      reviewLateArrivals:
        "Attendance is healthy, but review late arrivals.",
    },
  },

  fr: {
    common: {
      dashboard: "Tableau de bord",
      employees: "Employés",
      departments: "Départements",
      teams: "Équipes",
      attendance: "Présence",
      reports: "Rapports",
      settings: "Paramètres",
      organization: "Organisation",
      aiAssistant: "Assistant IA",
      logout: "Déconnexion",
      loading: "Chargement...",
      viewAll: "Voir tout",
      live: "En direct",
      people: "Personnel",
rolesPermissions: "Rôles et permissions",
menu: "Menu",
search: "Rechercher...",
notifications: "Notifications",
theme: "Thème",
    },

    dashboard: {
      todaysOverview: "Aperçu du jour",
      realTimeSummary:
        "Résumé en temps réel de l'organisation",
      recentActivity: "Activité récente",
      latestActions:
        "Dernières actions au sein de votre organisation",
      employees: "Employés",
      present: "Présents",
      late: "En retard",
      onLeave: "En congé",
      attendanceRate: "Taux de présence",
      healthScore: "Score de santé",
      organizationHealth: "Santé de l'organisation",
      sapAiSummary: "Résumé SAP IA",
      noRecentActivities:
        "Aucune activité récente.",
      excellentAttendance:
        "Excellente présence aujourd'hui.",
      reviewLateArrivals:
        "La présence est bonne, mais vérifiez les retards.",
    },
  },

  ar: {
    common: {
      dashboard: "لوحة التحكم",
      employees: "الموظفون",
      departments: "الأقسام",
      teams: "الفرق",
      attendance: "الحضور",
      reports: "التقارير",
      settings: "الإعدادات",
      organization: "المؤسسة",
      aiAssistant: "المساعد الذكي",
      logout: "تسجيل الخروج",
      loading: "جارٍ التحميل...",
      viewAll: "عرض الكل",
      live: "مباشر",
      people: "الموظفون",
rolesPermissions: "الأدوار والصلاحيات",
menu: "القائمة",
search: "البحث...",
notifications: "الإشعارات",
theme: "المظهر",
    },

    dashboard: {
      todaysOverview: "نظرة عامة على اليوم",
      realTimeSummary:
        "ملخص المؤسسة في الوقت الفعلي",
      recentActivity: "النشاط الأخير",
      latestActions:
        "أحدث الإجراءات داخل مؤسستك",
      employees: "الموظفون",
      present: "الحاضرون",
      late: "المتأخرون",
      onLeave: "في إجازة",
      attendanceRate: "نسبة الحضور",
      healthScore: "مؤشر صحة المؤسسة",
      organizationHealth: "صحة المؤسسة",
      sapAiSummary: "ملخص SAP الذكي",
      noRecentActivities:
        "لا توجد أنشطة حديثة.",
      excellentAttendance:
        "حضور ممتاز اليوم.",
      reviewLateArrivals:
        "الحضور جيد، ولكن يُرجى مراجعة حالات التأخير.",
    },
  },
} as const;

export type TranslationDictionary =
  typeof translations.en;

export function getTranslations(
  locale: Locale
): TranslationDictionary {
  return translations[
    locale
  ] as TranslationDictionary;
}
