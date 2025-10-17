// NAVIGATION

export const NAV_LINKS = [
  { 
    key: "departments", 
    label: "Departments", 
    href: "/departments",
    subLinks: [
      { key: "cardiology", label: "Cardiology", href: "/departments/cardiology" },
      { key: "pediatrics", label: "Pediatrics", href: "/departments/pediatrics" },
      { key: "neurology", label: "Neurology", href: "/departments/neurology" },
      { key: "orthopedics", label: "Orthopedics", href: "/departments/orthopedics" },
      { key: "ophthalmology", label: "Ophthalmology", href: "/departments/ophthalmology" },
      { key: "dentistry", label: "Dentistry", href: "/departments/dentistry" },
      { key: "view-all", label: "View All", href: "/departments" },
    ]
  },
  { 
    key: "schools", 
    label: "Schools", 
    href: "/schools",
    subLinks: [
      { key: "nursing", label: "Nursing", href: "/schools/nursing" },
      { key: "midwifery", label: "Midwifery", href: "/schools/midwifery" },
      { key: "health-info", label: "Health Information", href: "/schools/health-information" },
    ]
  },
  { key: "services", label: "Services", href: "/services" },
  { key: "board", label: "Board", href: "/board" },
  { key: "about", label: "About", href: "/about" },
  { key: "emergency", label: "Emergency", href: "/emergency" },
  { key: "contact", label: "Contact", href: "/contact" },
];

export const AUTH_LINKS = [
  { key: "login", label: "Login", href: "/auth/login" },
];

export const ADMIN_LINKS = [
  { key: "admin-login", label: "Admin", href: "/admin/login" },
];