import { Property, Inquiry, RentalApplication, Lease, PaymentRecord, LandlordPaymentInstructions } from '../types';

export const INITIAL_LANDLORD_INSTRUCTIONS: LandlordPaymentInstructions = {
  zelleEmail: 'rent@bostonapartmentlisting.com',
  zellePhone: '(617) 555-0198',
  venmoHandle: '@BostonLandlord-Admin',
  bankName: 'Eastern Bank (Boston, MA)',
  bankAccountHolder: 'Boston Property Management LLC',
  bankRoutingNumber: '011001234',
  bankAccountNumberLast4: '7821',
  checkMailingAddress: 'Boston Property Management LLC\nAttn: Rental Accounting\nPO Box 842, Back Bay Station\nBoston, MA 02117',
  generalNotes: 'Please include your Property Address and Unit Number in the payment memo. Payments received via Zelle or Venmo are verified within 2-4 business hours. For checks, allow 3-5 business days for mail and clearance.'
};

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-stuart-110-26a',
    title: 'The W Hotel Residences - Luxury Sky Residence 26A',
    streetAddress: '110 Stuart St',
    unit: 'Unit 26A',
    city: 'Boston',
    state: 'MA',
    zipCode: '02116',
    neighborhood: 'Theater District / Back Bay',
    monthlyRent: 4500,
    securityDeposit: 4500,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 876,
    propertyType: 'Condo',
    availableDate: '2026-10-01',
    description: 'Breathtaking 26th-floor residence at The W Boston Residences featuring unobstructed panoramic views from floor-to-ceiling glass walls. Open-concept floor plan with custom hardwood floors and a designer chef kitchen outfitted with top-tier Sub-Zero refrigeration, Wolf gas cooktop, and Asko dishwasher. Spacious bedroom suite boasts a custom walk-in closet and a spa-inspired bathroom with an oversized walk-in glass shower and double vanities. Full hotel luxury amenities including 24-hour concierge, 1 assigned valet parking space, state-of-the-art fitness center, and privileged access to the W Hotel Lounge & Bliss Spa.',
    amenities: [
      'Valet Parking Included',
      '24/7 Concierge Service',
      'Sub-Zero & Wolf Appliances',
      'Floor-to-Ceiling Windows',
      'Fitness Center Access',
      'In-Unit Washer & Dryer',
      'Central Air Conditioning',
      'Hardwood Floors',
      'Pet Friendly',
      'Elevator Building',
      'Walk-in Closet',
      'High-Speed Internet Ready'
    ],
    petPolicy: 'Cats and Dogs Allowed',
    parking: '1 Assigned Valet Parking Space Included',
    laundry: 'In-unit',
    airConditioning: 'Central Air Conditioning with Digital Thermostat',
    heating: 'Forced Air (Included in Rent via HOA)',
    sourcePortal: 'compass',
    sourceUrl: 'https://www.compass.com/homedetails/110-Stuart-St-Unit-26A-Boston-MA-02116/1552204048448867145_lid/',
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Available',
    createdAt: '2026-09-15T09:00:00Z',
    walkScore: 98,
    transitScore: 100,
    nearbyTransit: [
      'MBTA Green Line - Boylston Station (0.1 mi)',
      'MBTA Orange Line - Chinatown Station (0.2 mi)',
      'MBTA Commuter Rail & Amtrak - South Station (0.6 mi)'
    ],
    featured: true
  },
  {
    id: 'prop-upham-39-3',
    title: 'Sunny 4-Bedroom Penthouse with Dual Balconies',
    streetAddress: '39 Upham St',
    unit: 'Unit 3',
    city: 'Malden',
    state: 'MA',
    zipCode: '02148',
    neighborhood: 'Malden Center / Greater Boston',
    monthlyRent: 3350,
    securityDeposit: 3350,
    bedrooms: 4,
    bathrooms: 1,
    squareFeet: 1450,
    propertyType: 'Penthouse',
    availableDate: '2026-09-01',
    description: 'Very large and sun-drenched 4-bedroom top-floor penthouse condo located on tree-lined Upham Street. Highlights include two private balconies offering open neighborhood views, gleaming hardwood floors throughout, and an expansive living room that connects effortlessly to a formal dining area. Generous modern kitchen features an eat-in breakfast bar, maple cabinetry, and extensive counter space. Four versatile bedrooms provide ideal setups for home offices or guest rooms. Dedicated in-unit laundry room, central A/C and heating, and private off-street parking included. Just a 10-minute walk to Malden Center MBTA Orange Line & Commuter Rail, 1-minute to Sullivan Square bus lines, and 5 minutes to downtown Malden dining and shopping.',
    amenities: [
      '2 Private Balconies',
      'Dedicated Off-Street Parking',
      'In-Unit Washer & Dryer',
      'Gleaming Hardwood Floors',
      'Central Air & Heating',
      'Dishwasher & Microwave',
      'Breakfast Bar Counter',
      'Pet Friendly',
      'Formal Dining Room',
      'Ample Storage Space'
    ],
    petPolicy: 'Cats and Dogs Allowed',
    parking: '1 Assigned Off-Street Driveway Space Included',
    laundry: 'In-unit',
    airConditioning: 'Central A/C',
    heating: 'Gas Forced Hot Air',
    sourcePortal: 'apartments',
    sourceUrl: 'https://www.apartments.com/39-upham-st-malden-ma-unit-3/zzyrqhx/',
    photos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502005229762-ee1b2b93e30f?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Available',
    createdAt: '2026-09-12T14:30:00Z',
    walkScore: 89,
    transitScore: 78,
    nearbyTransit: [
      'MBTA Orange Line - Malden Center (0.5 mi - 10 min walk)',
      'MBTA Bus 104 & 105 to Sullivan Sq (1 min walk)',
      'MBTA Haverhill Commuter Rail (0.5 mi)'
    ],
    featured: true
  },
  {
    id: 'prop-newbury-240',
    title: 'Historic Back Bay Brownstone Residence',
    streetAddress: '240 Newbury St',
    unit: 'Unit 4B',
    city: 'Boston',
    state: 'MA',
    zipCode: '02116',
    neighborhood: 'Back Bay',
    monthlyRent: 3950,
    securityDeposit: 3950,
    bedrooms: 2,
    bathrooms: 1.5,
    squareFeet: 1120,
    propertyType: 'Brownstone',
    availableDate: '2026-10-15',
    description: 'Quintessential Back Bay living on world-renowned Newbury Street. This renovated top-floor residence features exposed brick walls, 10-foot ceilings, an ornamental marble fireplace, and skylights that bathe the living area in warm natural light. Granite and stainless steel kitchen with breakfast island, modern tile bathrooms, and exclusive shared roof deck access with 360-degree skyline views of Boston.',
    amenities: [
      'Shared Roof Deck with Skyline Views',
      'Exposed Brick Walls',
      'In-Unit Laundry',
      'Granite Countertops',
      'Decorative Fireplace',
      'Stainless Steel Appliances',
      'Hardwood Floors',
      'Cats Allowed'
    ],
    petPolicy: 'Cats Only',
    parking: 'Street Permit or Rental Garage Nearby',
    laundry: 'In-unit',
    airConditioning: 'Ductless Mini-Split High Efficiency A/C',
    heating: 'High Efficiency Heat Pump',
    sourcePortal: 'compass',
    sourceUrl: 'https://www.compass.com/homedetails/240-Newbury-St-Boston-MA-02116/',
    photos: [
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Available',
    createdAt: '2026-09-10T11:00:00Z',
    walkScore: 99,
    transitScore: 96,
    nearbyTransit: [
      'MBTA Green Line - Copley Station (0.2 mi)',
      'MBTA Orange Line - Back Bay Station (0.4 mi)'
    ],
    featured: false
  },
  {
    id: 'prop-sleeper-45',
    title: 'Seaport District Brick & Beam Designer Loft',
    streetAddress: '45 Sleeper St',
    unit: 'Unit 602',
    city: 'Boston',
    state: 'MA',
    zipCode: '02210',
    neighborhood: 'Seaport / Fort Point',
    monthlyRent: 4200,
    securityDeposit: 4200,
    bedrooms: 1,
    bathrooms: 2,
    squareFeet: 1080,
    propertyType: 'Condo',
    availableDate: '2026-11-01',
    description: 'Authentic historic Fort Point Channel brick-and-beam loft with soaring 12-foot timber ceilings, original exposed brick, and massive industrial windows overlooking Boston Harbor inlet. Open chef kitchen with quartz waterfall island, custom European cabinetry, primary bedroom with en-suite bath and customized California Closets.',
    amenities: [
      'Authentic Brick & Beam Architecture',
      'Harbor Views',
      'Quartz Waterfall Island',
      'In-Unit Washer/Dryer',
      'Freight Elevator & Passenger Elevator',
      'Bicycle Storage Room',
      'Dog Friendly with Dog Wash Station'
    ],
    petPolicy: 'Cats and Dogs Allowed',
    parking: 'Garage Parking Available for Rent',
    laundry: 'In-unit',
    airConditioning: 'Central A/C',
    heating: 'Gas Heating',
    sourcePortal: 'apartments',
    sourceUrl: 'https://www.apartments.com/45-sleeper-st-boston-ma-unit-602/',
    photos: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Available',
    createdAt: '2026-09-08T15:00:00Z',
    walkScore: 95,
    transitScore: 92,
    nearbyTransit: [
      'MBTA Silver Line - Courthouse Station (0.1 mi)',
      'MBTA Red Line - South Station (0.4 mi)'
    ],
    featured: false
  },
  {
    id: 'prop-oxford-120',
    title: 'Harvard Square Garden-Level Classic Flat',
    streetAddress: '120 Oxford St',
    unit: 'Unit 2',
    city: 'Cambridge',
    state: 'MA',
    zipCode: '02138',
    neighborhood: 'Cambridge / Harvard Square',
    monthlyRent: 3400,
    securityDeposit: 3400,
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 940,
    propertyType: 'Apartment',
    availableDate: '2026-09-15',
    description: 'Charming and updated 2-bedroom home situated on quiet Oxford Street, moments to Harvard Law School and Harvard Yard. Features sunny bay windows, hardwood flooring, renovated kitchen with stone countertops and dishwasher, and a shared landscaped garden patio.',
    amenities: [
      'Shared Garden Patio',
      'Hardwood Floors',
      'Dishwasher & Disposal',
      'On-Site Laundry Facilities',
      'Bike Storage',
      'Heat & Hot Water Included in Rent'
    ],
    petPolicy: 'Case by Case',
    parking: 'Cambridge Resident Permit Street Parking',
    laundry: 'In-building',
    airConditioning: 'Window Units Provided',
    heating: 'Steam Radiators (Included)',
    sourcePortal: 'compass',
    sourceUrl: 'https://www.compass.com/homedetails/120-Oxford-St-Cambridge-MA-02138/',
    photos: [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Available',
    createdAt: '2026-09-05T10:00:00Z',
    walkScore: 93,
    transitScore: 88,
    nearbyTransit: [
      'MBTA Red Line - Harvard Station (0.4 mi)',
      'MBTA Bus 77 & 96 (0.2 mi)'
    ],
    featured: false
  }
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-101',
    propertyId: 'prop-stuart-110-26a',
    propertyTitle: 'The W Hotel Residences - Luxury Sky Residence 26A',
    propertyAddress: '110 Stuart St Unit 26A, Boston, MA 02116',
    userName: 'Elena Rostova',
    userEmail: 'elena.rostova@biogen.com',
    userPhone: '(617) 482-9912',
    moveInDate: '2026-10-01',
    tourRequested: true,
    tourDate: '2026-09-24',
    tourTime: '2:30 PM',
    tourType: 'In-Person',
    message: 'Hello! I am a senior researcher relocating to Boston for a position in Cambridge. The 26th floor views and concierge service at 110 Stuart are ideal. Can we confirm an in-person viewing this Thursday afternoon? Also, is the valet parking space included in the base rent?',
    status: 'New',
    createdAt: '2026-09-20T16:15:00Z'
  },
  {
    id: 'inq-102',
    propertyId: 'prop-upham-39-3',
    propertyTitle: 'Sunny 4-Bedroom Penthouse with Dual Balconies',
    propertyAddress: '39 Upham St Unit 3, Malden, MA 02148',
    userName: 'Marcus Chen',
    userEmail: 'marcus.chen@northeastern.edu',
    userPhone: '(857) 321-4091',
    moveInDate: '2026-09-28',
    tourRequested: true,
    tourDate: '2026-09-23',
    tourTime: '11:00 AM',
    tourType: 'Virtual Video Tour',
    message: 'Hi there, my roommates and I (graduate engineers and working professionals) are very interested in 39 Upham St Unit 3. The 4 bedrooms and dual balconies look wonderful. We would love to do a FaceTime/Zoom virtual tour as one of our roommates is currently finishing an internship in New York. Thank you!',
    status: 'Replied',
    createdAt: '2026-09-19T14:20:00Z'
  }
];

export const INITIAL_APPLICATIONS: RentalApplication[] = [
  {
    id: 'app-201',
    propertyId: 'prop-stuart-110-26a',
    propertyTitle: 'The W Hotel Residences - Luxury Sky Residence 26A',
    propertyAddress: '110 Stuart St Unit 26A, Boston, MA 02116',
    monthlyRent: 4500,
    applicant: {
      fullName: 'Dr. Julian Thorne',
      email: 'j.thorne@massgeneral.org',
      phone: '(617) 726-2000',
      dob: '1988-04-14',
      currentAddress: '42 Beacon St, Boston, MA 02108',
      currentLandlordName: 'Charlesgate Management',
      currentLandlordPhone: '(617) 555-8930',
      currentRent: 4200,
      reasonForMoving: 'Seeking updated building amenities, valet parking, and closer proximity to South Station corridor.'
    },
    employment: {
      employer: 'Massachusetts General Hospital / Harvard Medical Faculty',
      position: 'Attending Radiologist',
      monthlyIncome: 24500,
      employmentLength: '5 years 2 months',
      supervisorName: 'Dr. Katherine Vance',
      supervisorPhone: '(617) 726-3040',
      paystubUploaded: true
    },
    occupants: {
      totalOccupants: 1,
      occupantNames: 'Julian Thorne',
      petsCount: 1,
      petDetails: 'French Bulldog (18 lbs, trained, up to date on vaccines)'
    },
    background: {
      hasEviction: false,
      hasBankruptcy: false,
      hasCriminalHistory: false,
      authorizationChecked: true,
      signatureName: 'Julian Thorne',
      signatureDate: '2026-09-18'
    },
    status: 'Pending',
    notes: 'Exceptional credit history (>790) and stable hospital employment. Income-to-rent ratio is over 5.4x.',
    submittedAt: '2026-09-18T18:45:00Z'
  },
  {
    id: 'app-202',
    propertyId: 'prop-upham-39-3',
    propertyTitle: 'Sunny 4-Bedroom Penthouse with Dual Balconies',
    propertyAddress: '39 Upham St Unit 3, Malden, MA 02148',
    monthlyRent: 3350,
    applicant: {
      fullName: 'Sarah Lindqvist',
      email: 'sarah.lindqvist@bostontech.io',
      phone: '(617) 834-5512',
      dob: '1995-11-03',
      currentAddress: '15 Centre St, Brookline, MA 02446',
      currentLandlordName: 'Brookline Village Realty',
      currentLandlordPhone: '(617) 555-4411',
      currentRent: 3100,
      reasonForMoving: 'Looking for a larger 4-bedroom with dedicated parking and balconies near the Orange line.'
    },
    employment: {
      employer: 'Wayfair LLC (Boston Copley Office)',
      position: 'Senior Product Designer',
      monthlyIncome: 11800,
      employmentLength: '3 years 8 months',
      supervisorName: 'David Miller',
      supervisorPhone: '(617) 532-6100',
      paystubUploaded: true
    },
    occupants: {
      totalOccupants: 3,
      occupantNames: 'Sarah Lindqvist, Maya Patel, Chloe Nguyen',
      petsCount: 0
    },
    background: {
      hasEviction: false,
      hasBankruptcy: false,
      hasCriminalHistory: false,
      authorizationChecked: true,
      signatureName: 'Sarah Lindqvist',
      signatureDate: '2026-09-19'
    },
    status: 'Accepted',
    notes: 'Application approved on 09/20. High credit score, verified employment. Lease agreement ready to be generated.',
    submittedAt: '2026-09-19T10:15:00Z'
  }
];

export const INITIAL_LEASES: Lease[] = [
  {
    id: 'lease-301',
    propertyId: 'prop-upham-39-3',
    propertyTitle: 'Sunny 4-Bedroom Penthouse with Dual Balconies',
    propertyAddress: '39 Upham St Unit 3, Malden, MA 02148',
    tenantName: 'Sarah Lindqvist',
    tenantEmail: 'sarah.lindqvist@bostontech.io',
    tenantPhone: '(617) 834-5512',
    startDate: '2026-10-01',
    endDate: '2027-09-30',
    monthlyRent: 3350,
    securityDeposit: 3350,
    keyDeposit: 100,
    rentDueDay: 1,
    gracePeriodDays: 5,
    utilitiesIncluded: ['Water & Sewer', 'Curbside Trash Removal', 'Landscaping & Snow Removal'],
    customRules: [
      'No smoking of any kind inside premises or on balconies',
      'Quiet hours strictly observed between 10:00 PM and 7:00 AM',
      'Tenant to maintain property in clean condition and notify landlord promptly of any plumbing leaks',
      'Off-street assigned parking spot #3 is reserved strictly for tenant vehicle'
    ],
    status: 'Sent to Tenant',
    createdAt: '2026-09-20T11:00:00Z'
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-401',
    leaseId: 'lease-301',
    propertyId: 'prop-upham-39-3',
    propertyTitle: 'Sunny 4-Bedroom Penthouse with Dual Balconies',
    tenantName: 'Sarah Lindqvist',
    tenantEmail: 'sarah.lindqvist@bostontech.io',
    amount: 3350,
    paymentType: 'Security Deposit',
    paymentMethod: 'Zelle',
    referenceNumber: 'ZEL-994821037',
    status: 'Verified',
    paymentDate: '2026-09-20',
    verifiedAt: '2026-09-20T13:45:00Z',
    notes: 'Security deposit transferred via Zelle to rent@bostonapartmentlisting.com',
    landlordReceiptNote: 'Received in Eastern Bank account. Security deposit escrow certificate dispatched to tenant.'
  },
  {
    id: 'pay-402',
    leaseId: 'lease-301',
    propertyId: 'prop-upham-39-3',
    propertyTitle: 'Sunny 4-Bedroom Penthouse with Dual Balconies',
    tenantName: 'Sarah Lindqvist',
    tenantEmail: 'sarah.lindqvist@bostontech.io',
    amount: 3350,
    paymentType: 'Monthly Rent',
    paymentMethod: 'Bank Transfer (ACH)',
    referenceNumber: 'ACH-88319024',
    status: 'Pending Verification',
    paymentDate: '2026-09-21',
    notes: 'First month rent payment initiated via Eastern Bank direct transfer.',
    landlordReceiptNote: ''
  }
];
