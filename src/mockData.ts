/**
 * Mock data for GCGrid demonstration
 */

export interface TableEntity {
  id: string;
  name: string;
  email: string;
  classYear: string;
  status: "Active" | "Inactive" | "Draft";
  affiliation: string;
  role: string;
  lastActive: string;
  totalDonations: number;
}

export const mockTableEntities: TableEntity[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    classYear: "2015",
    status: "Active",
    affiliation: "Alumni",
    role: "Donor",
    lastActive: "2024-01-15",
    totalDonations: 5000,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    classYear: "2018",
    status: "Active",
    affiliation: "Parent",
    role: "Volunteer",
    lastActive: "2024-01-14",
    totalDonations: 2500,
  },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol.williams@example.com",
    classYear: "2020",
    status: "Inactive",
    affiliation: "Student",
    role: "Member",
    lastActive: "2023-12-01",
    totalDonations: 500,
  },
  {
    id: "4",
    name: "David Brown",
    email: "david.brown@example.com",
    classYear: "2016",
    status: "Active",
    affiliation: "Alumni",
    role: "Donor",
    lastActive: "2024-01-16",
    totalDonations: 10000,
  },
  {
    id: "5",
    name: "Emma Davis",
    email: "emma.davis@example.com",
    classYear: "2019",
    status: "Draft",
    affiliation: "Alumni",
    role: "Donor",
    lastActive: "2024-01-10",
    totalDonations: 1500,
  },
  {
    id: "6",
    name: "Frank Miller",
    email: "frank.miller@example.com",
    classYear: "2017",
    status: "Active",
    affiliation: "Parent",
    role: "Volunteer",
    lastActive: "2024-01-15",
    totalDonations: 3000,
  },
  {
    id: "7",
    name: "Grace Wilson",
    email: "grace.wilson@example.com",
    classYear: "2021",
    status: "Active",
    affiliation: "Student",
    role: "Member",
    lastActive: "2024-01-16",
    totalDonations: 200,
  },
  {
    id: "8",
    name: "Henry Moore",
    email: "henry.moore@example.com",
    classYear: "2014",
    status: "Inactive",
    affiliation: "Alumni",
    role: "Donor",
    lastActive: "2023-11-20",
    totalDonations: 7500,
  },
  {
    id: "9",
    name: "Iris Taylor",
    email: "iris.taylor@example.com",
    classYear: "2022",
    status: "Active",
    affiliation: "Student",
    role: "Member",
    lastActive: "2024-01-15",
    totalDonations: 100,
  },
  {
    id: "10",
    name: "Jack Anderson",
    email: "jack.anderson@example.com",
    classYear: "2013",
    status: "Active",
    affiliation: "Alumni",
    role: "Donor",
    lastActive: "2024-01-14",
    totalDonations: 15000,
  },
  {
    id: "11",
    name: "Kate Thomas",
    email: "kate.thomas@example.com",
    classYear: "2019",
    status: "Active",
    affiliation: "Parent",
    role: "Volunteer",
    lastActive: "2024-01-16",
    totalDonations: 4000,
  },
  {
    id: "12",
    name: "Leo Jackson",
    email: "leo.jackson@example.com",
    classYear: "2020",
    status: "Draft",
    affiliation: "Alumni",
    role: "Member",
    lastActive: "2024-01-05",
    totalDonations: 0,
  },
];
