import type { User, Department } from "../types/user";

const management: Department = {
  id: 1,
  name: "Management",
  description: "Executive leadership and administration",
};

const finance: Department = {
  id: 3,
  name: "Finance",
  description: "Finance and Accounting",
};

const informationTechnology: Department = {
  id: 2,
  name: "Information Technology",
  description: "Software, AI and IT Services",
};

const humanResources: Department = {
  id: 4,
  name: "Human Resources",
  description: "Recruitment and Employee Management",
};

export const users: User[] = [
  {
    id: 1,
    employeeId: "SAP-0001",
    name: "Simeon Dzuamo",
    email: "info@simmylinkafrica.com",
    phone: "+212 600 123 456",
    location: "Casablanca, Morocco",

    departmentId: management.id,
    department: management,

    role: "Founder",
    status: "Active",
    dateJoined: "27 Jul 2026",
  },

  {
    id: 2,
    employeeId: "SAP-0002",
    name: "Aisha Bello",
    email: "aisha@simmylinkafrica.com",
    phone: "+234 803 456 7890",
    location: "Abuja, Nigeria",

    departmentId: finance.id,
    department: finance,

    role: "Administrator",
    status: "Active",
    dateJoined: "15 Jul 2026",
  },

  {
    id: 3,
    employeeId: "SAP-0003",
    name: "Michael Johnson",
    email: "michael@simmylinkafrica.com",
    phone: "+27 82 123 4567",
    location: "Johannesburg, South Africa",

    departmentId: informationTechnology.id,
    department: informationTechnology,

    role: "Manager",
    status: "Pending",
    dateJoined: "20 Jul 2026",
  },

  {
    id: 4,
    employeeId: "SAP-0004",
    name: "Grace Mensah",
    email: "grace@simmylinkafrica.com",
    phone: "+233 24 123 4567",
    location: "Accra, Ghana",

    departmentId: humanResources.id,
    department: humanResources,

    role: "Employee",
    status: "Suspended",
    dateJoined: "05 Jul 2026",
  },
];