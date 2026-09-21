export type SourcePortal = 'compass' | 'apartments' | 'manual';

export interface PropertyPhoto {
  url: string;
  caption?: string;
  isCover?: boolean;
}

export interface TourSlot {
  id: string;
  date: string;
  time: string;
  isBooked?: boolean;
  bookedBy?: string;
}

export interface UnitTourAvailability {
  enabled: boolean;
  availableDates: string[];
  timeSlots: string[];
  tourType: 'In-Person' | 'Virtual Video Tour' | 'Both';
  meetingInstructions: string;
  updatedAt?: string;
  slots?: TourSlot[];
}

export interface Property {
  id: string;
  title: string;
  streetAddress: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  neighborhood: string;
  monthlyRent: number;
  securityDeposit: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: 'Condo' | 'Apartment' | 'Penthouse' | 'Brownstone' | 'Single Family' | 'Townhouse';
  availableDate: string;
  description: string;
  amenities: string[];
  petPolicy: 'Cats and Dogs Allowed' | 'Cats Only' | 'Small Dogs Allowed' | 'No Pets' | 'Case by Case';
  parking: string;
  laundry: 'In-unit' | 'In-building' | 'None' | 'Hookup';
  airConditioning: string;
  heating: string;
  sourcePortal: SourcePortal;
  sourceUrl?: string;
  photos: string[];
  status: 'Available' | 'Pending' | 'Leased';
  createdAt: string;
  transitScore?: number;
  walkScore?: number;
  nearbyTransit?: string[];
  featured?: boolean;
  tourAvailability?: UnitTourAvailability;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  moveInDate: string;
  tourRequested: boolean;
  tourDate?: string;
  tourTime?: string;
  tourType?: 'In-Person' | 'Virtual Video Tour';
  message: string;
  status: 'New' | 'Replied' | 'Tour Scheduled' | 'Archived';
  createdAt: string;
}

export interface RentalApplication {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  monthlyRent: number;
  applicant: {
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    currentAddress: string;
    currentLandlordName?: string;
    currentLandlordPhone?: string;
    currentRent?: number;
    reasonForMoving?: string;
  };
  employment: {
    employer: string;
    position: string;
    monthlyIncome: number;
    employmentLength: string;
    supervisorName?: string;
    supervisorPhone?: string;
    additionalIncome?: string;
    paystubUploaded?: boolean;
  };
  occupants: {
    totalOccupants: number;
    occupantNames: string;
    petsCount: number;
    petDetails?: string;
  };
  background: {
    hasEviction: boolean;
    hasBankruptcy: boolean;
    hasCriminalHistory: boolean;
    additionalComments?: string;
    authorizationChecked: boolean;
    signatureName: string;
    signatureDate: string;
  };
  status: 'Pending' | 'Accepted' | 'Declined' | 'Lease Sent' | 'Completed';
  notes?: string;
  submittedAt: string;
  tourScheduled?: {
    date: string;
    time: string;
    type: 'In-Person' | 'Virtual Video Tour';
    status: 'Scheduled' | 'Completed' | 'Cancelled';
    bookedAt: string;
    notes?: string;
  };
}

export interface Lease {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  keyDeposit: number;
  rentDueDay: number;
  gracePeriodDays: number;
  utilitiesIncluded: string[];
  customRules: string[];
  status: 'Draft' | 'Sent to Tenant' | 'Signed by Tenant' | 'Active' | 'Expired';
  tenantSignature?: string;
  tenantSignedAt?: string;
  landlordSignature?: string;
  landlordSignedAt?: string;
  createdAt: string;
}

export type PaymentMethod = 'Zelle' | 'Venmo' | 'Bank Transfer (ACH)' | 'Cashier Check / Mail' | 'Other';

export interface PaymentRecord {
  id: string;
  leaseId?: string;
  propertyId: string;
  propertyTitle: string;
  tenantName: string;
  tenantEmail: string;
  amount: number;
  paymentType: 'Monthly Rent' | 'Security Deposit' | 'Key Deposit' | 'Late Fee' | 'Other';
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  status: 'Pending Verification' | 'Verified' | 'Overdue' | 'Rejected';
  paymentDate: string;
  verifiedAt?: string;
  notes?: string;
  landlordReceiptNote?: string;
}

export interface LandlordPaymentInstructions {
  zelleEmail: string;
  zellePhone: string;
  venmoHandle: string;
  bankName: string;
  bankAccountHolder: string;
  bankRoutingNumber: string;
  bankAccountNumberLast4: string;
  checkMailingAddress: string;
  generalNotes: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'tenant' | 'admin';
  createdAt: string;
}
