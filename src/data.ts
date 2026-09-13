export interface Clinic {
  id: string;
  slug: string;
  name: string;
  area: string;
  address: string;
  hours: string;
  image: string;
}

export interface Specialty {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export type ConsultationType = "In-clinic" | "Video";

export interface Doctor {
  id: string;
  slug: string;
  name: string;
  specialtyId: string;
  clinicId: string;
  rating: number;
  reviews: number;
  fee: number;
  experience: number;
  languages: string[];
  consultationTypes: ConsultationType[];
  image: string;
  featured: boolean;
  bio: string;
}

export interface EnrichedDoctor extends Doctor {
  specialty: string;
  clinic: string;
  area: string;
}

export interface NotificationItem {
  id: string;
  category: string;
  title: string;
  message: string;
  read: boolean;
}

export const clinics: Clinic[] = [
  {
    id: "clinic-olaya",
    slug: "olaya-medical-center",
    name: "Olaya Medical Center",
    area: "Al Olaya",
    address: "King Fahd Road, Al Olaya, Riyadh",
    hours: "Sun–Thu · 9:00 AM–6:00 PM",
    image: "/images/clinics/olaya-medical-center.webp",
  },
  {
    id: "clinic-heart",
    slug: "medora-heart-clinic",
    name: "Medora Heart Clinic",
    area: "Al Nakheel",
    address: "Northern Ring Road, Al Nakheel, Riyadh",
    hours: "Sun–Thu · 8:30 AM–5:00 PM",
    image: "/images/clinics/medora-heart-clinic.webp",
  },
  {
    id: "clinic-little",
    slug: "little-steps-clinic",
    name: "Little Steps Clinic",
    area: "Al Malqa",
    address: "Anas Bin Malik Road, Al Malqa, Riyadh",
    hours: "Sun–Thu · 9:00 AM–7:00 PM",
    image: "/images/clinics/little-steps-clinic.webp",
  },
  {
    id: "clinic-motion",
    slug: "motion-medical",
    name: "Motion Medical",
    area: "King Fahd",
    address: "Olaya Street, King Fahd, Riyadh",
    hours: "Sun–Thu · 8:00 AM–5:30 PM",
    image: "/images/clinics/motion-medical.webp",
  },
];

export const specialties: Specialty[] = [
  {
    id: "spec-derm",
    slug: "dermatology",
    name: "Dermatology",
    description: "Care for skin, hair, and nail concerns.",
  },
  {
    id: "spec-cardio",
    slug: "cardiology",
    name: "Cardiology",
    description: "Consultations focused on heart and cardiovascular health.",
  },
  {
    id: "spec-peds",
    slug: "pediatrics",
    name: "Pediatrics",
    description: "Age-appropriate care for infants, children, and adolescents.",
  },
  {
    id: "spec-ortho",
    slug: "orthopedics",
    name: "Orthopedics",
    description: "Care for bones, joints, movement, and sports injuries.",
  },
];

export const doctors: Doctor[] = [
  {
    id: "1",
    slug: "layla-hassan",
    name: "Dr. Layla Hassan",
    specialtyId: "spec-derm",
    clinicId: "clinic-olaya",
    rating: 4.9,
    reviews: 214,
    fee: 280,
    experience: 12,
    languages: ["Arabic", "English"],
    consultationTypes: ["In-clinic", "Video"],
    image: "/images/doctors/layla-hassan.webp",
    featured: true,
    bio: "Consultant dermatologist focused on evidence-based care for skin, hair, and nail conditions.",
  },
  {
    id: "2",
    slug: "omar-alharbi",
    name: "Dr. Omar Alharbi",
    specialtyId: "spec-cardio",
    clinicId: "clinic-heart",
    rating: 4.8,
    reviews: 186,
    fee: 350,
    experience: 15,
    languages: ["Arabic", "English"],
    consultationTypes: ["In-clinic"],
    image: "/images/doctors/omar-alharbi.webp",
    featured: true,
    bio: "Cardiology consultant providing thoughtful preventive and ongoing cardiovascular care.",
  },
  {
    id: "3",
    slug: "sara-khalid",
    name: "Dr. Sara Khalid",
    specialtyId: "spec-peds",
    clinicId: "clinic-little",
    rating: 4.9,
    reviews: 302,
    fee: 240,
    experience: 10,
    languages: ["Arabic", "English", "French"],
    consultationTypes: ["In-clinic", "Video"],
    image: "/images/doctors/sara-khalid.webp",
    featured: true,
    bio: "Pediatric consultant committed to reassuring families and making every visit comfortable.",
  },
  {
    id: "4",
    slug: "fahad-nasser",
    name: "Dr. Fahad Nasser",
    specialtyId: "spec-ortho",
    clinicId: "clinic-motion",
    rating: 4.7,
    reviews: 149,
    fee: 320,
    experience: 14,
    languages: ["Arabic", "English"],
    consultationTypes: ["In-clinic"],
    image: "/images/doctors/fahad-nasser.webp",
    featured: false,
    bio: "Orthopedic consultant specializing in sports injuries, joints, and mobility recovery.",
  },
  {
    id: "5",
    slug: "reem-mansour",
    name: "Dr. Reem Mansour",
    specialtyId: "spec-derm",
    clinicId: "clinic-olaya",
    rating: 4.8,
    reviews: 127,
    fee: 260,
    experience: 9,
    languages: ["Arabic", "English"],
    consultationTypes: ["In-clinic", "Video"],
    image: "/images/doctors/reem-mansour.webp",
    featured: false,
    bio: "Dermatology specialist offering clear, practical care plans tailored to each patient.",
  },
  {
    id: "6",
    slug: "yousef-saleh",
    name: "Dr. Yousef Saleh",
    specialtyId: "spec-cardio",
    clinicId: "clinic-heart",
    rating: 4.6,
    reviews: 98,
    fee: 300,
    experience: 11,
    languages: ["Arabic", "English"],
    consultationTypes: ["In-clinic", "Video"],
    image: "/images/doctors/yousef-saleh.webp",
    featured: false,
    bio: "Cardiology specialist with a calm, collaborative approach to patient consultations.",
  },
  {
    id: "7",
    slug: "nora-adel",
    name: "Dr. Nora Adel",
    specialtyId: "spec-peds",
    clinicId: "clinic-little",
    rating: 4.8,
    reviews: 174,
    fee: 220,
    experience: 8,
    languages: ["Arabic", "English"],
    consultationTypes: ["In-clinic"],
    image: "/images/doctors/nora-adel.webp",
    featured: false,
    bio: "Pediatrics specialist focused on supportive communication with children and their families.",
  },
  {
    id: "8",
    slug: "tariq-kamal",
    name: "Dr. Tariq Kamal",
    specialtyId: "spec-ortho",
    clinicId: "clinic-motion",
    rating: 4.7,
    reviews: 113,
    fee: 290,
    experience: 13,
    languages: ["Arabic", "English", "Urdu"],
    consultationTypes: ["In-clinic", "Video"],
    image: "/images/doctors/tariq-kamal.webp",
    featured: false,
    bio: "Orthopedics specialist helping patients understand their mobility and recovery options.",
  },
];

export const navigation: [string, string][] = [
  ["/", "nav.home"],
  ["/doctors", "nav.doctors"],
  ["/specialties", "nav.specialties"],
  ["/clinics", "nav.clinics"],
  ["/about", "nav.about"],
  ["/faq", "nav.faq"],
];

export const initialNotifications: NotificationItem[] = [];

export const getSpecialty = (id: string): Specialty | undefined =>
  specialties.find((item) => item.id === id);

export const getClinic = (id: string): Clinic | undefined =>
  clinics.find((item) => item.id === id);

export const enrichDoctor = (doctor: Doctor): EnrichedDoctor => ({
  ...doctor,
  specialty: getSpecialty(doctor.specialtyId)?.name || "Unknown",
  clinic: getClinic(doctor.clinicId)?.name || "Unknown",
  area: getClinic(doctor.clinicId)?.area || "Unknown",
});
