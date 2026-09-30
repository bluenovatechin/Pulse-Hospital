/**
 * Pulse Hospital & I.C.U - Hospital Data
 * Extracted directly from brochure images: 1.jpeg, 2.jpeg, 3.jpeg, 4.jpeg
 * Preserves the exact Gujarati text, English text, and numerical formatting as printed.
 *
 * Every piece of information appears once. Page-specific wording and layout
 * (column splits, alternate headers) live in `sourcePages` at the bottom.
 */

const pulseHospitalData = {
  hospitalInfo: {
    nameEnglish: "PULSE HOSPITAL & I.C.U",
    nameGujarati: "પલ્સ હોસ્પિટલ એન્ડ આઈ.સી.યુ.",
    tagline: "CARING FOR LIFE",
    emergencyBadge: "24x7 EMERGENCY & TRUMA CARE",
    appointmentNumbers: [
      "63533 44875"
      // "95120 456 41", // Original Brochure Line 1 (Commented out for testing mode)
      // "95120 456 42"  // Original Brochure Line 2 (Commented out for testing mode)
    ],
    appointmentTextEnglish: "FOR APPOINTMENT 63533 44875",
    appointmentTextGujarati: "એપોઇન્ટમેન્ટ : ૬૩૫૩૩ ૪૪૮૭૫",
    visitNoticeEnglish: "Please bring this file on next visit.",
    addressEnglish: {
      line1: "4th Floor, A-block, City Centre, Shamlaji Road,",
      city: "Modasa",
      district: "Arvalli",
      pincode: "383315",
      fullAddress: "4th Floor, A-block, City Centre, Shamlaji Road, Modasa, Arvalli-383315"
    },
    addressGujarati: {
      line1: "ચોથો માળ, એ-બ્લોક, સીટી સેન્ટર, શામળાજી રોડ,",
      city: "મોડાસા",
      district: "અરવલ્લી",
      pincode: "૩૮૩૩૧૫",
      fullAddress: "ચોથો માળ, એ-બ્લોક, સીટી સેન્ટર, શામળાજી રોડ, મોડાસા, અરવલ્લી-૩૮૩૩૧૫"
    }
  },

  // Doctors from the front cover (1.jpeg), merged with their Gujarati
  // affiliated-hospital entries from 2.jpeg (સંલગ્ન હોસ્પિટલ)
  doctors: [
    {
      id: 1,
      name: "Dr Dipesh S. Patel",
      qualification: "MD Medicine",
      hospital: "Deep Hospital",
      nameGujarati: "ડૉ. દિપેશ પટેલ",
      hospitalGujarati: "દીપ હોસ્પિટલ, મોડાસા",
      mobileGujarati: "મો.: ૭૫૬૭૪ ૦૭૨૭૨",
      mobileNumber: "75674 07272"
    },
    {
      id: 2,
      name: "Dr. Naimuddin N. Kazi",
      qualification: "MD (Medicine)",
      hospital: "Hayat Hospital",
      nameGujarati: "ડૉ. નઈમુદ્દીન કાઝી",
      hospitalGujarati: "હયાત હોસ્પિટલ, મોડાસા",
      mobileGujarati: "મો.: ૯૫૧૨૦ ૪૫૬૪૬",
      mobileNumber: "95120 45646"
    },
    {
      id: 3,
      name: "Dr Paras H Patel",
      qualification: "MD (Medicine)",
      hospital: "Vedant Hospital, Modasa",
      nameGujarati: "ડૉ. પારસ પટેલ",
      hospitalGujarati: "વેદાંત હોસ્પિટલ, મોડાસા",
      mobileGujarati: "મો.: ૮૧૬૦૮ ૧૦૦૧૩",
      mobileNumber: "81608 10013"
    },
    {
      id: 4,
      name: "Dr Santosh J Prajapati",
      qualification: "MBBS, DTCD, FICCM",
      designation: "Chest Physician & Critical Care Specialist",
      hospital: "Medicare Hospital & ICU",
      nameGujarati: "ડૉ. સંતોષ પ્રજાપતિ",
      hospitalGujarati: "મેડીકેર હોસ્પિટલ & આઈ.સી.યુ., મોડાસા",
      mobileGujarati: "મો.: ૮૨૦૦૨ ૪૦૨૮૭",
      mobileNumber: "82002 40287"
    },
    {
      id: 5,
      name: "Dr. Mohammad Salim Mansuri",
      designation: "Medical Officer",
      specialization: "Critical Care Specialist"
    },
    {
      id: 6,
      name: "Dr. Pulkit Pandya",
      designation: "Medical Officer",
      specialization: "Critical Care Specialist"
    }
  ],

  // Affiliated hospitals box on 2.jpeg; doctorIds are in printed order.
  // Use getAffiliatedHospitals() below for the resolved list.
  affiliatedHospitals: {
    titleGujarati: "સંલગ્ન હોસ્પિટલ",
    doctorIds: [1, 2, 4, 3]
  },

  // Hospital departments from 2.jpeg
  departments: {
    icu: {
      categoryGujarati: "આઈ.સી.યુ.",
      services: [
        "આઈ.સી.સી.યુ.",
        "મેડીકલ આઈ.સી.સી.યુ.",
        "સર્જીકલ આઈ.સી.યુ.",
        "આઈસોલેશન આઈ.સી.યુ.",
        "સોનોગ્રાફી",
        "ડાયાલીસીસ",
        "વેન્ટીલેટર",
        "ડીફીબ્રીલેટર",
        "2D Echo"
      ]
    },
    indoorDepartment: {
      categoryGujarati: "ઈનડોર વિભાગ",
      services: [
        "ડીલક્ષ રૂમ",
        "ટ્વીન રૂમ",
        "સ્પેશ્યલ રૂમ"
      ]
    },
    outdoorDepartment: {
      categoryGujarati: "આઉટડોર વિભાગ",
      services: [
        "ઓ.પી.ડી.",
        "24x7 ફાર્મસી",
        "સુપર સ્પેશ્યાલીસ્ટ કન્સલ્ટેશન",
        "રેડિયોલોજી",
        "પેથોલોજી"
      ]
    },
    lungsDepartment: {
      categoryGujarati: "ફેફસા વિભાગ",
      services: [
        "બ્રોન્કોસ્કોપી (દુરબીન દ્વારા ફેફસાની તપાસ)",
        "શ્વાસના રોગો (અસ્થમા, COPD)",
        "ફેફસામાં ભરાયેલ પાણીનો ઈલાજ",
        "પી.એફ.ટી. (ફુક દ્વારા ફેફસાની તપાસ)",
        "સ્લીપ સ્ટડી"
      ]
    },
    operationDepartment: {
      categoryGujarati: "ઓપરેશન",
      services: [
        "લેમેલર મોડ્યુલર ઓપરેશન થીયેટર",
        "હાઈ રીસ્ક સર્જરી",
        "ગેસ્ટ્રો અને લેપ્રોસ્કોપી સર્જરી",
        "ન્યુરો સર્જરી",
        "સ્પાઈન સર્જરી",
        "પ્લાસ્ટીક સર્જરી"
      ]
    }
  },

  // Treatments available from 3.jpeg (ઉપલબ્ધ સારવાર)
  availableTreatmentsList: {
    titleGujarati: "ઉપલબ્ધ સારવાર",
    treatments: [
      "બ્રેઈન હેમરેજ, લકવાની સારવાર",
      "ઝેરી મલેરીયા, ડેન્ગ્યુમાં પ્લેટલેટ ઘટી જવા",
      "કોમા, મગજનો તાવ અને ખેંચ",
      "દાઝેલાની સારવાર, ઝેરી કમળાની સારવાર",
      "લીવર અને કીડની રોગોની સારવાર",
      "શ્વાસ અને હૃદય ની બિમારીની સારવાર",
      "હીટ સ્ટ્રોક, ઇલેક્ટ્રીક શોક, હડીલો તાવ",
      "ઝેરી દવા અને સર્પદંશ સારવાર",
      "કોઈપણ જાતની ગંભીર બિમારી",
      "અકસ્માતને લગતી ઈજાની સારવાર"
    ]
  },

  // Facilities available in hospital from 3.jpeg (હોસ્પિટલમાં ઉપલબ્ધ સુવિધાઓ)
  hospitalFacilitiesList: {
    titleGujarati: "હોસ્પિટલમાં ઉપલબ્ધ સુવિધાઓ",
    facilities: [
      "24x7 એમ.ડી. I.C.U. સ્પેશ્યાલીસ્ટ ડોક્ટર ઉપલબ્ધ",
      "24x7 કલાક ડાયાલિસીસની સુવિધા ઉપલબ્ધ",
      "24x7 લેબોરેટરી કાર્યરત",
      "24x7 કલાક મેડિકલ સુવિધા ઉપલબ્ધ",
      "ક્વોલિફાઇડ સ્ટાફ દ્વારા I.C.U. ની દેખરેખ",
      "અનુભવી નર્સીંગ સ્ટાફ",
      "અત્ય અધતન સુસજ્જ મોડ્યુલર ઓપરેશન થીયેટર",
      "ઓર્થોપેડીક સર્જરી માટે IITV ની સુવિધા",
      "લેપ્રોસ્કોપીક તેમજ એન્ડોસ્કોપી સુવિધા",
      "ગેસ્ટ્રોલોજી અને હેપેટોલોજી સુવિધા",
      "ન્યુરો / મણકાની સર્જરી વિભાગ",
      "મેક્સિલો ફેશિયલ (ડેન્ટલ) સર્જન વિભાગ",
      "કાર્ડિયોલોજી સુવિધા",
      "ઇન્ફેક્શન રોગ સારવાર",
      "24x7 ક્રિટીકલ કેર સુવિધા",
      "હૃદયની સોનોગ્રાફી 2D Echo",
      "જનરલ સર્જરી",
      "પ્મોલોજી",
      "ફીઝીયોથેરાપી વિભાગ",
      "ઈન-હાઉસ સીટી સ્કેનની સુવિધા",
      "પાર્કિંગની સુવિધા"
    ]
  },

  // Key Facilities with highlights and equipment from 4.jpeg (ઉપલબ્ધ સુવિધાઓ)
  featuredFacilities: {
    titleGujarati: "ઉપલબ્ધ સુવિધાઓ",
    items: [
      {
        title: "અદ્યતન I.C.C.U., M.I.C.U., S.I.C.U",
        description: "વેન્ટીલેટર, સેન્ટ્રલ ઓક્સિજન, સેન્ટ્રલ મોનિટરિંગ, સેન્ટ્રલ સક્સન, ડીફેબ્રીલેટર, ઈ.સી.જી., મોબાઇલ એક્સ-રે, ટ્રોમા સેન્ટર"
      },
      {
        title: "અદ્યતન સાધનોથી સજ્જ મોડ્યુલર ઓપરેશન થીયેટર",
        description: ""
      },
      {
        title: "સુપર ડીલક્ષ અને સેમી. સ્પેશીયલ રૂમની સુવિધા",
        description: ""
      },
      {
        title: "ડાયાલીસીસ યુનિટ 24 X 7 ઈમરજન્સી ડાયાલીસીસ સુવિધા",
        description: ""
      },
      {
        title: "2D Echo અને સોનોગ્રાફી (USG) સુવિધા (24 X 7 ઈમરજન્સી)",
        description: ""
      },
      {
        title: "ઈન-હાઉસ સીટી સ્કેન (મોડાસા CT સ્કેન સેન્ટર)",
        description: ""
      },
      {
        title: "ડીજીટલ એક્સ-રે તથા મોબાઇલ એક્સ-રે",
        description: ""
      },
      {
        title: "ઈન હાઉસ લેબોરેટરી તથા ફાર્મસીની સુવિધા",
        description: ""
      }
    ]
  },

  // Categorized Medical Treatments from 4.jpeg (ઉપલબ્ધ સારવાર)
  treatmentCategories: {
    titleGujarati: "ઉપલબ્ધ સારવાર",
    categories: [
      {
        categoryName: "હૃદય રોગો / એન્ડોક્રાઇન",
        conditions: "હાર્ટ એટેક, બી.પી., થાઇરોઇડ, ડાયાબીટીસ"
      },
      {
        categoryName: "ફેફસાના રોગો",
        conditions: "શ્વાસ ચડવો, ન્યુમોનીયા, ફેફસામા પાણી ભરાવુ."
      },
      {
        categoryName: "સર્પદંશ / પોઇઝનીંગ",
        conditions: "ઝેરી જીવજંતુના દંશ અને પોઇઝનીંગની સારવાર"
      },
      {
        categoryName: "કીડનીને લગતા રોગો",
        conditions: "પથરી, કીડની પર સોજો, પેશાબમાં રસી થવી"
      },
      {
        categoryName: "લીવર / પેટના રોગો",
        conditions: "કમળો, ઝાડા ઉલ્ટી આંતરડાનો સોજો"
      },
      {
        categoryName: "મગજના રોગો",
        conditions: "લકવો, મગજનું હેમરેજ, ખેંચ, મગજનો તાવ"
      },
      {
        categoryName: "તાવ",
        conditions: "મેલેરીયા, ડેન્ગ્યુ, ટાઇફોઇડ, ચિકનગુનીયા"
      },
      {
        categoryName: "ટ્રોમા / ઈમરજન્સી",
        conditions: "અકસ્માત, દાઝી જવું, વીજ કરંટ લાગવો, હીટ સ્ટ્રોક"
      }
    ]
  },

  // What each brochure page contains, plus wording/layout that differs from
  // the shared data above. Everything not listed here is identical to it.
  sourcePages: {
    "1.jpeg": {
      sections: ["hospitalInfo", "doctors"],
      appointmentHeader: "FOR APPOINTMENT",
      appointmentPhones: "95120 456 41 / 95120 456 42",
      hospitalNameFooter: "PULSE HOSPITAL & ICU"
    },
    "2.jpeg": {
      sections: ["hospitalInfo", "departments", "affiliatedHospitals"],
      appointmentHeader: "For Appointment",
      appointmentPhones: [
        "M : 95120 456 41",
        "M : 95120 456 42"
      ],
      // As printed, without the space used in doctors[id 3].mobileGujarati
      parasPatelContactAsPrinted: "મો.: ૮૧૬૦૮૧૦૦૧૩"
    },
    "3.jpeg": {
      sections: ["hospitalInfo", "availableTreatmentsList", "hospitalFacilitiesList"],
      // Number of items printed in the first of two columns
      column1ItemCount: {
        availableTreatmentsList: 5,
        hospitalFacilitiesList: 11
      }
    },
    "4.jpeg": {
      sections: ["featuredFacilities", "treatmentCategories"],
      // Footer uses hospitalInfo.nameGujarati, addressGujarati.fullAddress
      // and appointmentTextGujarati
      footerFields: ["nameGujarati", "addressGujarati.fullAddress", "appointmentTextGujarati"],
      // As printed (line break instead of a comma)
      kidneyConditionsAsPrinted: "પથરી, કીડની પર સોજો પેશાબમાં રસી થવી"
    }
  }
};

// Affiliated hospitals resolved to full doctor objects, in printed order
function getAffiliatedHospitals() {
  return pulseHospitalData.affiliatedHospitals.doctorIds.map((id) =>
    pulseHospitalData.doctors.find((doctor) => doctor.id === id)
  );
}

// CommonJS support
if (typeof module !== "undefined" && module.exports) {
  module.exports = pulseHospitalData;
}

// Browser global support
if (typeof window !== "undefined") {
  window.pulseHospitalData = pulseHospitalData;
}

// ES Module export default
export default pulseHospitalData;
export { pulseHospitalData, getAffiliatedHospitals };
