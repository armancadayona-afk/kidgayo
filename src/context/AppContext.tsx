import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Property,
  Inquiry,
  RentalApplication,
  Lease,
  PaymentRecord,
  LandlordPaymentInstructions,
  UserAccount,
  UnitTourAvailability
} from '../types';
import {
  INITIAL_PROPERTIES,
  INITIAL_INQUIRIES,
  INITIAL_APPLICATIONS,
  INITIAL_LEASES,
  INITIAL_PAYMENTS,
  INITIAL_LANDLORD_INSTRUCTIONS
} from '../data/initialData';

interface AppContextType {
  properties: Property[];
  inquiries: Inquiry[];
  applications: RentalApplication[];
  leases: Lease[];
  payments: PaymentRecord[];
  landlordInstructions: LandlordPaymentInstructions;
  currentRole: 'tenant' | 'admin';
  currentUser: UserAccount | null;
  currentView: 'marketplace' | 'tenant-portal' | 'admin-console';
  setCurrentView: (view: 'marketplace' | 'tenant-portal' | 'admin-console') => void;
  setView: (view: 'marketplace' | 'tenant-portal' | 'admin-console') => void;
  setRole: (role: 'tenant' | 'admin') => void;
  selectedProperty: Property | null;
  setSelectedProperty: (prop: Property | null) => void;
  setCurrentRole: (role: 'tenant' | 'admin') => void;
  setCurrentUser: (user: UserAccount | null) => void;
  addProperty: (property: Property) => void;
  addBulkProperties: (newProperties: Property[]) => void;
  updateProperty: (property: Property) => void;
  deleteProperty: (propertyId: string) => void;
  setUnitTourAvailability: (propertyId: string, availability: UnitTourAvailability) => void;
  hasUserAppliedForProperty: (propertyId: string, email?: string) => boolean;
  getUserApplicationForProperty: (propertyId: string, email?: string) => RentalApplication | undefined;
  scheduleTourForApplication: (applicationId: string, tourData: { date: string; time: string; type: 'In-Person' | 'Virtual Video Tour'; notes?: string }) => void;
  submitInquiry: (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => Inquiry;
  updateInquiryStatus: (inquiryId: string, status: Inquiry['status']) => void;
  submitApplication: (appData: Omit<RentalApplication, 'id' | 'submittedAt' | 'status'>) => RentalApplication;
  updateApplicationStatus: (applicationId: string, status: RentalApplication['status'], notes?: string) => void;
  createLease: (leaseData: Omit<Lease, 'id' | 'createdAt' | 'status'>) => Lease;
  signLeaseTenant: (leaseId: string, signatureName: string) => void;
  countersignLeaseLandlord: (leaseId: string, signatureName: string) => void;
  recordPayment: (paymentData: Omit<PaymentRecord, 'id' | 'status' | 'verifiedAt'>) => PaymentRecord;
  verifyPayment: (paymentId: string, landlordReceiptNote?: string) => void;
  updateLandlordInstructions: (instructions: LandlordPaymentInstructions) => void;
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROPERTIES: 'apartmentlisting_boston_properties_v2',
  INQUIRIES: 'apartmentlisting_boston_inquiries_v2',
  APPLICATIONS: 'apartmentlisting_boston_applications_v2',
  LEASES: 'apartmentlisting_boston_leases_v2',
  PAYMENTS: 'apartmentlisting_boston_payments_v2',
  INSTRUCTIONS: 'apartmentlisting_boston_instructions_v2',
  ROLE: 'apartmentlisting_current_role_v2',
  USER: 'apartmentlisting_current_user_v2'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PROPERTIES;
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_INQUIRIES;
  });

  const [applications, setApplications] = useState<RentalApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_APPLICATIONS;
  });

  const [leases, setLeases] = useState<Lease[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEASES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_LEASES;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PAYMENTS;
  });

  const [landlordInstructions, setLandlordInstructions] = useState<LandlordPaymentInstructions>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INSTRUCTIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_LANDLORD_INSTRUCTIONS;
  });

  const [currentRole, setCurrentRoleState] = useState<'tenant' | 'admin'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      if (saved === 'admin' || saved === 'tenant') return saved;
    } catch (e) {
      console.error(e);
    }
    return 'tenant';
  });

  const [currentUser, setCurrentUserState] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      id: 'usr-default-tenant',
      fullName: 'Elena Rostova',
      email: 'elena.rostova@biogen.com',
      phone: '(617) 482-9912',
      role: 'tenant',
      createdAt: '2026-09-01T12:00:00Z'
    };
  });

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentView, setCurrentView] = useState<'marketplace' | 'tenant-portal' | 'admin-console'>('marketplace');

  const setRole = (role: 'tenant' | 'admin') => {
    setCurrentRole(role);
    if (role === 'admin') {
      setCurrentView('admin-console');
    } else {
      setCurrentView('marketplace');
    }
  };

  const setView = (view: 'marketplace' | 'tenant-portal' | 'admin-console') => {
    setCurrentView(view);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEASES, JSON.stringify(leases));
  }, [leases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSTRUCTIONS, JSON.stringify(landlordInstructions));
  }, [landlordInstructions]);

  const setCurrentRole = (role: 'tenant' | 'admin') => {
    setCurrentRoleState(role);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  };

  const setCurrentUser = (user: UserAccount | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  };

  const addProperty = (property: Property) => {
    setProperties(prev => [property, ...prev]);
  };

  const addBulkProperties = (newProperties: Property[]) => {
    setProperties(prev => [...newProperties, ...prev]);
  };

  const updateProperty = (updated: Property) => {
    setProperties(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const deleteProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const setUnitTourAvailability = (propertyId: string, availability: UnitTourAvailability) => {
    setProperties(prev =>
      prev.map(p => {
        if (p.id === propertyId) {
          return {
            ...p,
            tourAvailability: availability
          };
        }
        return p;
      })
    );
  };

  const hasUserAppliedForProperty = (propertyId: string, email?: string): boolean => {
    const targetEmail = (email || currentUser?.email || 'elena.rostova@biogen.com').toLowerCase().trim();
    return applications.some(app => {
      if (app.propertyId !== propertyId) return false;
      // Match by email if known, or match any application submitted in current session
      if (targetEmail) {
        return app.applicant.email.toLowerCase().trim() === targetEmail;
      }
      return true;
    });
  };

  const getUserApplicationForProperty = (propertyId: string, email?: string): RentalApplication | undefined => {
    const targetEmail = (email || currentUser?.email || 'elena.rostova@biogen.com').toLowerCase().trim();
    return applications.find(app => {
      if (app.propertyId !== propertyId) return false;
      if (targetEmail) {
        return app.applicant.email.toLowerCase().trim() === targetEmail;
      }
      return true;
    });
  };

  const scheduleTourForApplication = (
    applicationId: string,
    tourData: { date: string; time: string; type: 'In-Person' | 'Virtual Video Tour'; notes?: string }
  ) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id === applicationId) {
          return {
            ...app,
            tourScheduled: {
              ...tourData,
              status: 'Scheduled',
              bookedAt: new Date().toISOString()
            }
          };
        }
        return app;
      })
    );

    // Also register an inquiry record so it appears on Landlord's tour schedule view
    const targetApp = applications.find(a => a.id === applicationId);
    if (targetApp) {
      const newInquiry: Inquiry = {
        id: 'inq-' + Date.now(),
        propertyId: targetApp.propertyId,
        propertyTitle: targetApp.propertyTitle,
        propertyAddress: targetApp.propertyAddress,
        userName: targetApp.applicant.fullName,
        userEmail: targetApp.applicant.email,
        userPhone: targetApp.applicant.phone,
        moveInDate: '2026-10-01',
        tourRequested: true,
        tourDate: tourData.date,
        tourTime: tourData.time,
        tourType: tourData.type,
        message: tourData.notes || `Tour scheduled following application approval (${tourData.type}) on ${tourData.date} at ${tourData.time}.`,
        status: 'Tour Scheduled',
        createdAt: new Date().toISOString()
      };
      setInquiries(prev => [newInquiry, ...prev]);
    }
  };

  const submitInquiry = (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry => {
    const newInquiry: Inquiry = {
      ...inquiryData,
      id: 'inq-' + Date.now(),
      status: 'New',
      createdAt: new Date().toISOString()
    };
    setInquiries(prev => [newInquiry, ...prev]);
    return newInquiry;
  };

  const updateInquiryStatus = (inquiryId: string, status: Inquiry['status']) => {
    setInquiries(prev => prev.map(inq => (inq.id === inquiryId ? { ...inq, status } : inq)));
  };

  const submitApplication = (appData: Omit<RentalApplication, 'id' | 'submittedAt' | 'status'>): RentalApplication => {
    const newApp: RentalApplication = {
      ...appData,
      id: 'app-' + Date.now(),
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };
    setApplications(prev => [newApp, ...prev]);
    return newApp;
  };

  const updateApplicationStatus = (applicationId: string, status: RentalApplication['status'], notes?: string) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id === applicationId) {
          return {
            ...app,
            status,
            notes: notes !== undefined ? notes : app.notes
          };
        }
        return app;
      })
    );
  };

  const createLease = (leaseData: Omit<Lease, 'id' | 'createdAt' | 'status'>): Lease => {
    const newLease: Lease = {
      ...leaseData,
      id: 'lease-' + Date.now(),
      status: 'Sent to Tenant',
      createdAt: new Date().toISOString()
    };
    setLeases(prev => [newLease, ...prev]);
    return newLease;
  };

  const signLeaseTenant = (leaseId: string, signatureName: string) => {
    setLeases(prev =>
      prev.map(l => {
        if (l.id === leaseId) {
          return {
            ...l,
            tenantSignature: signatureName,
            tenantSignedAt: new Date().toISOString(),
            status: 'Signed by Tenant'
          };
        }
        return l;
      })
    );
  };

  const countersignLeaseLandlord = (leaseId: string, signatureName: string) => {
    setLeases(prev =>
      prev.map(l => {
        if (l.id === leaseId) {
          return {
            ...l,
            landlordSignature: signatureName,
            landlordSignedAt: new Date().toISOString(),
            status: 'Active'
          };
        }
        return l;
      })
    );
  };

  const recordPayment = (paymentData: Omit<PaymentRecord, 'id' | 'status' | 'verifiedAt'>): PaymentRecord => {
    const newPayment: PaymentRecord = {
      ...paymentData,
      id: 'pay-' + Date.now(),
      status: 'Pending Verification',
      paymentDate: paymentData.paymentDate || new Date().toISOString().split('T')[0]
    };
    setPayments(prev => [newPayment, ...prev]);
    return newPayment;
  };

  const verifyPayment = (paymentId: string, landlordReceiptNote?: string) => {
    setPayments(prev =>
      prev.map(p => {
        if (p.id === paymentId) {
          return {
            ...p,
            status: 'Verified',
            verifiedAt: new Date().toISOString(),
            landlordReceiptNote: landlordReceiptNote || 'Payment confirmed and credited to rental ledger.'
          };
        }
        return p;
      })
    );
  };

  const updateLandlordInstructions = (instructions: LandlordPaymentInstructions) => {
    setLandlordInstructions(instructions);
  };

  const resetToInitialData = () => {
    setProperties(INITIAL_PROPERTIES);
    setInquiries(INITIAL_INQUIRIES);
    setApplications(INITIAL_APPLICATIONS);
    setLeases(INITIAL_LEASES);
    setPayments(INITIAL_PAYMENTS);
    setLandlordInstructions(INITIAL_LANDLORD_INSTRUCTIONS);
    localStorage.removeItem(STORAGE_KEYS.PROPERTIES);
    localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.LEASES);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.INSTRUCTIONS);
  };

  return (
    <AppContext.Provider
      value={{
        properties,
        inquiries,
        applications,
        leases,
        payments,
        landlordInstructions,
        currentRole,
        currentUser,
        currentView,
        setCurrentView,
        setView,
        setRole,
        selectedProperty,
        setSelectedProperty,
        setCurrentRole,
        setCurrentUser,
        addProperty,
        addBulkProperties,
        updateProperty,
        deleteProperty,
        setUnitTourAvailability,
        hasUserAppliedForProperty,
        getUserApplicationForProperty,
        scheduleTourForApplication,
        submitInquiry,
        updateInquiryStatus,
        submitApplication,
        updateApplicationStatus,
        createLease,
        signLeaseTenant,
        countersignLeaseLandlord,
        recordPayment,
        verifyPayment,
        updateLandlordInstructions,
        resetToInitialData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
