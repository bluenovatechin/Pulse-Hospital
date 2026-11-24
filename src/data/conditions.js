// ========================================================
// Health conditions treated at Pulse Hospital (patient information pages:
// /conditions and /conditions/<slug>).
//
// MEDICAL REVIEW RULE
// Every page is a draft until a Pulse Hospital doctor has read and approved
// it. A draft page can be opened by its address (for the doctor to review),
// but it is hidden from search engines, the sitemap and the site menus.
// To publish a page, fill in its `review`, for example:
//   review: { by: 'dr-dipesh-patel', date: '2026-12-01' }
// (`by` is the reviewing doctor's slug from hospitalContent.js).
//
// Only conditions the hospital actually treats are listed (they come from
// the departments' "Conditions treated" lists). Tests and treatments named
// here are the ones the hospital data lists; nothing else is promised.
// ========================================================

const draft = null;

export const CONDITIONS = [
  {
    slug: 'dengue',
    name: 'Dengue fever',
    nameGu: 'ડેન્ગ્યુ',
    alt: ['Dengue', 'Dengue with low platelets', 'Dengue haemorrhagic fever'],
    department: 'medicine',
    facilityIds: ['lab', 'icu'],
    summary:
      'Dengue is a viral fever spread by the bite of the Aedes mosquito. Most people recover with rest, fluids and paracetamol, but a few develop dangerous bleeding or shock, usually around the time the fever settles, so platelet counts and warning signs need close watching.',
    summaryGu: 'ડેન્ગ્યુ એડીસ મચ્છરના કરડવાથી ફેલાતો વાયરલ તાવ છે. મોટાભાગના દર્દીઓ આરામ અને પ્રવાહીથી સાજા થાય છે, પણ પ્લેટલેટ્સ અને ચેતવણીનાં લક્ષણો પર નજર રાખવી જરૂરી છે.',
    symptoms: [
      'Sudden high fever',
      'Severe headache and pain behind the eyes',
      'Body, joint and muscle pain',
      'Nausea or vomiting',
      'Skin rash',
      'Tiredness and loss of appetite'
    ],
    warning: [
      'Severe stomach pain or vomiting that does not stop',
      'Bleeding from the gums or nose, black stools or blood in vomit',
      'Cold, clammy skin, restlessness or extreme drowsiness',
      'Passing very little urine',
      'Difficulty breathing'
    ],
    causes: [
      'Bite of an infected Aedes mosquito, which breeds in clean stagnant water (coolers, tyres, pots, water tanks)',
      'Most cases appear during and just after the monsoon',
      'A second dengue infection can be more severe than the first'
    ],
    diagnosis: [
      'Dengue test panel and complete blood count in the 24x7 laboratory',
      'Repeated platelet counts to see the trend',
      'Blood pressure, pulse and fluid balance checks if admitted'
    ],
    treatment:
      'There is no specific medicine that kills the dengue virus. Care focuses on fluids, fever control with paracetamol and close monitoring. The doctor decides whether you can be treated at home or need admission for IV fluids, and patients with warning signs or shock are cared for in the ICU.',
    prevention: [
      'Empty and cover water containers every week',
      'Use mosquito nets, repellents and full-sleeve clothes, especially in the daytime',
      'Do not take aspirin or painkillers such as ibuprofen for dengue fever unless a doctor advises it'
    ],
    faqs: [
      {
        q: 'At what platelet count is dengue dangerous?',
        a: 'There is no single number that decides it. A falling platelet count together with warning signs such as bleeding, stomach pain or drowsiness matters more than the count alone, so follow the doctor’s advice on repeat tests.'
      },
      {
        q: 'Can dengue be treated at home?',
        a: 'Many patients can rest at home with plenty of fluids and paracetamol, after a doctor has examined them. Come to the hospital at once if any warning sign appears.'
      },
      {
        q: 'Is dengue testing available at Pulse Hospital?',
        a: 'Yes. The 24x7 laboratory at Pulse Hospital, Modasa runs dengue, malaria and typhoid panels and platelet counts.'
      }
    ],
    review: draft
  },
  {
    slug: 'malaria',
    name: 'Malaria',
    nameGu: 'મેલેરિયા',
    alt: ['Malaria fever', 'Fever with chills'],
    department: 'medicine',
    facilityIds: ['lab', 'icu'],
    summary:
      'Malaria is a fever caused by a parasite carried by Anopheles mosquitoes. It typically causes fever with shivering and sweating. It is fully treatable with the right medicines, but some types can become serious within days if treatment is delayed.',
    summaryGu: 'મેલેરિયા એનોફિલિસ મચ્છરથી ફેલાતો તાવ છે, જેમાં ઠંડી લાગીને તાવ આવે છે. સમયસર સાચી દવાથી તે સંપૂર્ણ મટી શકે છે.',
    symptoms: [
      'Fever with chills and shivering, followed by sweating',
      'Headache',
      'Body ache and weakness',
      'Nausea or vomiting',
      'Fever that comes back in cycles'
    ],
    warning: [
      'Confusion, unusual drowsiness or fits',
      'Yellow eyes or dark urine',
      'Breathlessness',
      'Very little urine',
      'Repeated vomiting so that medicines cannot be kept down'
    ],
    causes: [
      'Bite of an infected Anopheles mosquito, usually at night',
      'More common in the monsoon and after it',
      'Living near stagnant water or fields with standing water'
    ],
    diagnosis: [
      'Malaria test in the 24x7 laboratory',
      'Complete blood count and other blood tests to check for complications'
    ],
    treatment:
      'Malaria is treated with antimalarial medicines chosen by the doctor according to the type of malaria and how unwell the patient is. Severe malaria needs admission, and the ICU is available for patients with complications.',
    prevention: [
      'Sleep under a mosquito net',
      'Use repellents and cover arms and legs in the evening',
      'Do not let water collect around the house',
      'Complete the full course of medicines even after the fever stops'
    ],
    faqs: [
      {
        q: 'How is malaria different from dengue?',
        a: 'Both cause fever after a mosquito bite. Malaria often causes fever with shivering that returns in cycles and is treated with antimalarial medicines; dengue is a virus treated with fluids and monitoring. A blood test tells them apart.'
      },
      {
        q: 'Can malaria come back?',
        a: 'Some types can return weeks later if the full course of treatment is not completed. Take every dose the doctor prescribes.'
      }
    ],
    review: draft
  },
  {
    slug: 'typhoid',
    name: 'Typhoid fever',
    nameGu: 'ટાઇફોઇડ',
    alt: ['Typhoid', 'Enteric fever'],
    department: 'medicine',
    facilityIds: ['lab'],
    summary:
      'Typhoid is a bacterial infection spread through contaminated food and water. It causes a fever that rises over several days, with stomach upset and weakness. It is treated with antibiotics prescribed by a doctor.',
    summaryGu: 'ટાઇફોઇડ દૂષિત ખોરાક અને પાણીથી ફેલાતો બેક્ટેરિયલ ચેપ છે. તેમાં ધીમે ધીમે વધતો તાવ આવે છે અને ડૉક્ટરની એન્ટીબાયોટિક દવાથી સારવાર થાય છે.',
    symptoms: [
      'Fever that gradually rises over several days',
      'Headache and weakness',
      'Stomach pain, constipation or diarrhoea',
      'Loss of appetite',
      'Coated tongue'
    ],
    warning: [
      'Severe stomach pain or a hard, swollen belly',
      'Blood in the stools or black stools',
      'Confusion or extreme drowsiness',
      'Fever that does not improve after a few days of treatment'
    ],
    causes: [
      'Drinking contaminated water or eating food handled without washing hands',
      'Street food and raw salads washed in unsafe water',
      'Close contact with a person who has typhoid'
    ],
    diagnosis: [
      'Typhoid test panel and blood counts in the 24x7 laboratory',
      'Other blood tests, as the doctor decides, to check for complications'
    ],
    treatment:
      'Typhoid is treated with antibiotics. The doctor chooses the medicine and how long to take it. Patients who are very weak, dehydrated or have complications are admitted for IV fluids and monitoring.',
    prevention: [
      'Drink boiled or purified water',
      'Wash hands with soap before eating and after using the toilet',
      'Avoid raw food from unknown sources',
      'A typhoid vaccine is available; ask the doctor if it is right for you'
    ],
    faqs: [
      {
        q: 'How long does typhoid take to get better?',
        a: 'Most patients start to feel better within a few days of the right antibiotic, but the full course must be completed. Your doctor will tell you how long.'
      },
      {
        q: 'What should I eat during typhoid?',
        a: 'Soft, freshly cooked, easy-to-digest food and plenty of safe fluids. Ask the doctor about any special diet.'
      }
    ],
    review: draft
  },
  {
    slug: 'diabetes',
    name: 'Diabetes',
    nameGu: 'ડાયાબિટીસ (મધુપ્રમેહ)',
    alt: ['Diabetes mellitus', 'High blood sugar', 'Sugar disease', 'Uncontrolled diabetes'],
    department: 'medicine',
    facilityIds: ['lab', 'icu'],
    summary:
      'Diabetes is a long-term condition in which blood sugar stays too high. It is controlled with diet, exercise and medicines, and regular check-ups help prevent damage to the heart, kidneys, eyes and nerves.',
    summaryGu: 'ડાયાબિટીસમાં લોહીમાં શુગર લાંબા સમય સુધી વધુ રહે છે. યોગ્ય ખોરાક, કસરત અને દવાથી તેને કાબૂમાં રાખી શકાય છે.',
    symptoms: [
      'Feeling very thirsty and passing urine often',
      'Tiredness',
      'Weight loss without trying',
      'Blurred vision',
      'Slow-healing wounds',
      'Tingling or numbness in the feet'
    ],
    warning: [
      'Drowsiness, confusion or unconsciousness',
      'Fast, deep breathing or vomiting with very high sugar',
      'Sweating, shaking and confusion with very low sugar',
      'A foot wound that is swelling, smelling or turning black'
    ],
    causes: [
      'Family history of diabetes',
      'Being overweight and not physically active',
      'Unhealthy diet high in sugar and refined food',
      'Diabetes during pregnancy',
      'Increasing age'
    ],
    diagnosis: [
      'Blood sugar tests in the 24x7 laboratory',
      'Kidney function, cholesterol and other tests to check for complications'
    ],
    treatment:
      'Treatment is planned by the physician and may include diet changes, exercise, tablets or insulin. Regular follow-up helps adjust the treatment. Emergencies such as very high or very low sugar are treated in the emergency room and the ICU.',
    prevention: [
      'Keep a healthy weight and walk or exercise every day',
      'Eat less sugar, sweets and fried food',
      'Get your blood sugar checked regularly after 30, or earlier if diabetes runs in the family',
      'Check your feet every day if you already have diabetes'
    ],
    faqs: [
      {
        q: 'Can diabetes be cured?',
        a: 'Type 2 diabetes usually cannot be cured, but it can be well controlled with lifestyle changes and medicines, so that people live a normal, active life.'
      },
      {
        q: 'Which doctor should I see for diabetes in Modasa?',
        a: 'The MD physicians at Pulse Hospital, Modasa treat diabetes and thyroid disorders in the OPD. You can book an appointment online or on WhatsApp.'
      }
    ],
    review: draft
  },
  {
    slug: 'high-blood-pressure',
    name: 'High blood pressure (hypertension)',
    nameGu: 'હાઈ બ્લડ પ્રેશર',
    alt: ['Hypertension', 'High BP', 'Hypertensive crisis'],
    department: 'medicine',
    extraDoctorIds: [5],
    facilityIds: ['lab', 'imaging', 'icu'],
    summary:
      'High blood pressure often causes no symptoms, but over the years it can damage the heart, brain and kidneys. Regular BP checks, a healthy lifestyle and medicines when needed keep it under control.',
    summaryGu: 'હાઈ બ્લડ પ્રેશરમાં ઘણીવાર કોઈ લક્ષણ નથી હોતું, પણ લાંબા ગાળે હૃદય, મગજ અને કિડનીને નુકસાન કરી શકે છે. નિયમિત તપાસ અને દવાથી તેને કાબૂમાં રાખી શકાય છે.',
    symptoms: [
      'Often no symptoms at all',
      'Headache, especially at the back of the head',
      'Dizziness',
      'Blurred vision',
      'Nosebleeds in some people'
    ],
    warning: [
      'Very high BP with severe headache, confusion or blurred vision',
      'Chest pain or breathlessness',
      'Weakness or numbness of one side of the body, or difficulty speaking',
      'Fits'
    ],
    causes: [
      'Too much salt in food',
      'Being overweight and inactive',
      'Smoking, tobacco and alcohol',
      'Stress',
      'Family history, diabetes and kidney disease'
    ],
    diagnosis: [
      'Repeated blood pressure readings',
      'Blood and urine tests in the 24x7 laboratory',
      'ECG and 2D Echo to check the heart, when the doctor advises'
    ],
    treatment:
      'The physician decides on lifestyle changes and medicines and adjusts them at follow-up visits. A sudden, very high BP with symptoms (hypertensive crisis) is an emergency and is treated in the emergency room and ICU.',
    prevention: [
      'Eat less salt, pickles and packaged snacks',
      'Walk or exercise for 30 minutes most days',
      'Stop smoking and tobacco',
      'Check your BP at least once a year, and take BP medicines regularly if prescribed'
    ],
    faqs: [
      {
        q: 'What is normal blood pressure?',
        a: 'For most adults, a reading below about 120/80 mmHg is considered normal. Your doctor will tell you the right target for you.'
      },
      {
        q: 'Can I stop BP tablets when my BP is normal?',
        a: 'No. Normal readings usually mean the medicine is working. Do not stop or change it without asking your doctor.'
      }
    ],
    review: draft
  },
  {
    slug: 'heart-attack',
    name: 'Heart attack',
    nameGu: 'હાર્ટ એટેક',
    alt: ['Myocardial infarction', 'Chest pain', 'Acute coronary syndrome'],
    department: 'cardiac',
    facilityIds: ['icu', 'lab', 'imaging', 'ambulance'],
    summary:
      'A heart attack happens when blood flow to part of the heart is blocked. It is an emergency: every minute matters. Call for help and reach a hospital with a cardiac ICU straight away.',
    summaryGu: 'હાર્ટ એટેકમાં હૃદયના ભાગમાં લોહી પહોંચતું અટકી જાય છે. આ ઇમરજન્સી છે, તરત હોસ્પિટલ પહોંચો.',
    symptoms: [
      'Chest pain, pressure or heaviness lasting more than a few minutes',
      'Pain spreading to the left arm, jaw, neck or back',
      'Sweating',
      'Breathlessness',
      'Nausea, vomiting or a feeling like severe acidity',
      'Sudden weakness or fainting'
    ],
    warning: [
      'Any chest pain with sweating or breathlessness: call for help now',
      'Do not wait to see if the pain goes away',
      'Do not drive yourself to the hospital if you can avoid it'
    ],
    causes: [
      'Diabetes and high blood pressure',
      'High cholesterol',
      'Smoking and tobacco',
      'Family history of heart disease',
      'Being overweight and inactive'
    ],
    diagnosis: [
      'ECG on arrival',
      'Cardiac troponin blood test (heart attack marker) in the 24x7 laboratory',
      '2D Echo to see how the heart is pumping'
    ],
    treatment:
      'Patients are treated in the I.C.C.U. (cardiac ICU) under the cardiologist, with monitoring, medicines and ventilator support if needed. If angiography or angioplasty is needed, the cardiologist explains the next step to the family.',
    prevention: [
      'Control diabetes, BP and cholesterol',
      'Stop smoking and tobacco',
      'Exercise regularly and keep a healthy weight',
      'Do not ignore chest pain, even if it feels like acidity'
    ],
    faqs: [
      {
        q: 'Is gas or acidity sometimes a heart attack?',
        a: 'Yes, a heart attack can feel like acidity, especially in people with diabetes and in older people. If the discomfort comes with sweating, breathlessness or weakness, treat it as an emergency.'
      },
      {
        q: 'Does Pulse Hospital have a heart specialist?',
        a: 'Yes. A DM cardiologist consults at Pulse Hospital, Modasa, and the hospital has a 15-bed I.C.C.U. for cardiac emergencies.'
      }
    ],
    review: draft
  },
  {
    slug: 'stroke',
    name: 'Stroke (paralysis)',
    nameGu: 'લકવો (પેરાલિસિસ / સ્ટ્રોક)',
    alt: ['Brain stroke', 'Paralysis', 'Brain haemorrhage', 'Brain attack'],
    department: 'neuro',
    facilityIds: ['ct', 'icu', 'emergency'],
    summary:
      'A stroke happens when blood supply to part of the brain is blocked or a blood vessel bursts. It causes sudden weakness, difficulty speaking or a drooping face. Treatment works best in the first few hours, so reach the hospital immediately.',
    summaryGu: 'મગજમાં લોહી પહોંચતું બંધ થાય અથવા નસ ફાટે ત્યારે લકવો થાય છે. અચાનક નબળાઈ, બોલવામાં તકલીફ કે મોં વાંકું થાય તો તરત હોસ્પિટલ પહોંચો.',
    symptoms: [
      'Face drooping on one side',
      'Weakness or numbness of an arm or leg, usually on one side',
      'Slurred speech or difficulty understanding',
      'Sudden loss of balance or vision',
      'Sudden severe headache'
    ],
    warning: [
      'Remember BE FAST: Balance, Eyes, Face, Arm, Speech, Time to call',
      'Note the time the symptoms started and tell the doctor',
      'Do not give food, water or medicines by mouth'
    ],
    causes: [
      'High blood pressure',
      'Diabetes and high cholesterol',
      'Smoking and tobacco',
      'Irregular heartbeat',
      'Increasing age'
    ],
    diagnosis: [
      'Emergency brain CT on the same floor, to tell a clot from a bleed',
      'Blood tests and ECG'
    ],
    treatment:
      'If the stroke is caused by a clot and the patient arrives early enough, the doctor may advise clot-dissolving treatment (thrombolysis). Patients are monitored in the ICU, and recovery continues with physiotherapy.',
    prevention: [
      'Keep BP, sugar and cholesterol under control',
      'Stop smoking and tobacco',
      'Take prescribed blood thinners and BP medicines regularly'
    ],
    faqs: [
      {
        q: 'How quickly must a stroke patient reach hospital?',
        a: 'As soon as possible. Clot-dissolving treatment can only be given within a few hours of the start of symptoms, so do not wait.'
      },
      {
        q: 'Is a CT scan available at night in Modasa?',
        a: 'Yes. Pulse Hospital has an in-house CT scan with priority 24x7 reporting for emergency cases.'
      }
    ],
    review: draft
  },
  {
    slug: 'kidney-failure',
    name: 'Kidney failure and dialysis',
    nameGu: 'કિડની ફેલ્યોર અને ડાયાલિસિસ',
    alt: ['Acute kidney failure', 'Acute renal failure', 'Chronic kidney disease', 'Dialysis'],
    department: 'kidney',
    facilityIds: ['dialysis', 'lab', 'icu'],
    summary:
      'Kidney failure means the kidneys can no longer clean the blood properly. It can come on suddenly (for example with severe infection, dehydration or poisoning) or slowly over years. Dialysis takes over the kidneys’ work when needed.',
    summaryGu: 'કિડની ફેલ્યોરમાં કિડની લોહી બરાબર સાફ કરી શકતી નથી. જરૂર પડે ત્યારે ડાયાલિસિસ કિડનીનું કામ કરે છે.',
    symptoms: [
      'Passing much less urine',
      'Swelling of the feet, face or around the eyes',
      'Tiredness and weakness',
      'Nausea, vomiting and loss of appetite',
      'Breathlessness'
    ],
    warning: [
      'Almost no urine for a day',
      'Severe breathlessness',
      'Confusion or drowsiness',
      'Chest pain or irregular heartbeat'
    ],
    causes: [
      'Long-standing diabetes and high blood pressure',
      'Severe infection, dehydration or blood loss',
      'Some poisons and medicines, including overuse of painkillers',
      'Kidney stones and repeated urinary infections'
    ],
    diagnosis: [
      'Kidney function and electrolyte tests in the 24x7 laboratory',
      'Urine tests',
      'Sonography of the kidneys'
    ],
    treatment:
      'The doctor treats the cause and decides whether dialysis is needed. Pulse Hospital has a 24x7 dialysis unit for emergency and scheduled maintenance dialysis, and bedside dialysis inside the ICU for critically ill patients.',
    prevention: [
      'Keep diabetes and BP under control',
      'Drink enough water unless the doctor advises otherwise',
      'Do not take painkillers regularly without a doctor’s advice',
      'Get kidney tests done every year if you have diabetes or high BP'
    ],
    faqs: [
      {
        q: 'Is dialysis available at night?',
        a: 'Yes. The dialysis unit at Pulse Hospital, Modasa works 24x7, including emergency dialysis.'
      },
      {
        q: 'Is dialysis needed for life?',
        a: 'Not always. In sudden kidney failure the kidneys often recover and dialysis can stop. In long-term kidney failure, regular dialysis may be needed. The doctor will explain your situation.'
      }
    ],
    review: draft
  },
  {
    slug: 'asthma-copd',
    name: 'Asthma and COPD',
    nameGu: 'અસ્થમા (દમ) અને COPD',
    alt: ['Asthma', 'COPD', 'Chronic bronchitis', 'Breathlessness', 'Wheezing'],
    department: 'chest',
    facilityIds: ['pulmo-lab', 'ct', 'icu'],
    summary:
      'Asthma and COPD are long-term lung conditions that narrow the airways and cause breathlessness, cough and wheezing. With the right diagnosis and inhalers, most people can control their symptoms and avoid hospital stays.',
    summaryGu: 'અસ્થમા અને COPD ફેફસાંના લાંબા ગાળાના રોગ છે, જેમાં શ્વાસ ચડે, ખાંસી અને સીટી જેવો અવાજ આવે છે. યોગ્ય ઇન્હેલરથી તેને કાબૂમાં રાખી શકાય છે.',
    symptoms: [
      'Breathlessness, especially on walking or at night',
      'Wheezing (a whistling sound while breathing)',
      'Cough, with or without phlegm',
      'Chest tightness'
    ],
    warning: [
      'Breathlessness that makes it hard to speak a full sentence',
      'Blue lips or fingertips',
      'Drowsiness or confusion',
      'Inhaler not helping'
    ],
    causes: [
      'Smoking, bidi and tobacco (the main cause of COPD)',
      'Smoke from cooking fires (chulha) and dust at work',
      'Allergies, pollen and dust (common triggers for asthma)',
      'Cold air and chest infections'
    ],
    diagnosis: [
      'PFT / spirometry (a breathing test) in the lung function lab',
      'HRCT chest when the chest physician advises',
      'Bronchoscopy in selected cases'
    ],
    treatment:
      'The chest physician prescribes inhalers and teaches the right way to use them. Severe attacks are treated in the emergency room and ICU, with oxygen and non-invasive or invasive ventilator support when needed.',
    prevention: [
      'Stop smoking and avoid smoke from chulhas and burning waste',
      'Use your inhaler every day if prescribed, even when you feel well',
      'Ask your doctor about flu and pneumonia vaccines'
    ],
    faqs: [
      {
        q: 'Are inhalers habit-forming?',
        a: 'No. Inhalers deliver a small dose of medicine directly to the lungs and are the safest, most effective treatment for asthma and COPD.'
      },
      {
        q: 'Is a lung function test (PFT) available in Modasa?',
        a: 'Yes. Pulse Hospital has a lung function and bronchoscopy lab with PFT / spirometry and sleep studies.'
      }
    ],
    review: draft
  },
  {
    slug: 'pneumonia',
    name: 'Pneumonia',
    nameGu: 'ન્યુમોનિયા',
    alt: ['Lung infection', 'Chest infection'],
    department: 'chest',
    extraDoctorIds: [1, 2],
    facilityIds: ['ct', 'lab', 'icu'],
    summary:
      'Pneumonia is an infection of the lungs that causes fever, cough and breathlessness. Mild pneumonia can be treated with medicines at home, but older people, young children and people with other illnesses may need hospital or ICU care.',
    summaryGu: 'ન્યુમોનિયા ફેફસાંનો ચેપ છે, જેમાં તાવ, ખાંસી અને શ્વાસ ચડે છે. ગંભીર કિસ્સામાં હોસ્પિટલ કે ICU સારવાર જોઈએ.',
    symptoms: [
      'Fever with chills',
      'Cough, often with phlegm',
      'Breathlessness',
      'Chest pain on breathing deeply or coughing',
      'Tiredness and loss of appetite'
    ],
    warning: [
      'Fast or difficult breathing',
      'Blue lips',
      'Confusion or drowsiness, especially in elderly people',
      'Low blood pressure or fainting'
    ],
    causes: [
      'Bacteria and viruses, including flu',
      'Older age, diabetes, heart, kidney or lung disease',
      'Smoking'
    ],
    diagnosis: [
      'Chest X-ray or HRCT chest',
      'Blood tests and arterial blood gas (ABG) in the 24x7 laboratory'
    ],
    treatment:
      'Treatment depends on how severe the pneumonia is: antibiotics or other medicines, oxygen, and ICU care with ventilator support for patients with breathing failure.',
    prevention: [
      'Ask the doctor about flu and pneumonia vaccines, especially for people over 60',
      'Stop smoking',
      'Wash hands regularly'
    ],
    faqs: [
      {
        q: 'How long does pneumonia take to heal?',
        a: 'Most people feel better within one to three weeks, but tiredness can last longer, especially in older people.'
      },
      {
        q: 'When is ICU care needed for pneumonia?',
        a: 'When the oxygen level is low, breathing is very difficult, blood pressure falls or the patient becomes confused. The ICU at Pulse Hospital has ventilators and central oxygen at every bed.'
      }
    ],
    review: draft
  },
  {
    slug: 'snakebite',
    name: 'Snakebite',
    nameGu: 'સાપ કરડવો (સર્પદંશ)',
    alt: ['Snake bite', 'Snake bite treatment', 'Anti-snake venom'],
    department: 'emergency',
    extraDoctorIds: [1, 2],
    facilityIds: ['emergency', 'icu', 'dialysis', 'ambulance'],
    summary:
      'A snakebite is an emergency. Keep the person calm and still, and bring them to a hospital that has anti-snake venom as quickly as possible. Do not waste time on home remedies.',
    summaryGu: 'સાપ કરડવો ઇમરજન્સી છે. દર્દીને શાંત અને સ્થિર રાખો અને એન્ટી-સ્નેક વેનમ ધરાવતી હોસ્પિટલમાં તરત લાવો. ઘરેલુ ઉપચારમાં સમય ન બગાડો.',
    symptoms: [
      'Pain, swelling or bleeding at the bite',
      'Drooping eyelids, double vision or difficulty swallowing',
      'Difficulty breathing',
      'Bleeding from gums, nose or in the urine',
      'Vomiting, dizziness or drowsiness'
    ],
    warning: [
      'Every snakebite needs hospital care, even if there is no pain at first',
      'Do not cut, suck or burn the bite, and do not tie a tight band',
      'Keep the bitten arm or leg still and remove rings and tight items',
      'Carry the person; walking spreads the venom faster'
    ],
    causes: [
      'Working in fields, especially at night or in the monsoon',
      'Walking barefoot or without a torch at night',
      'Sleeping on the floor'
    ],
    diagnosis: [
      'Examination of the bite and symptoms by the emergency doctor',
      'Blood clotting tests in the 24x7 laboratory'
    ],
    treatment:
      'The emergency team follows a snakebite protocol and gives anti-snake venom when needed. Patients are monitored closely; those with breathing difficulty receive ventilator support in the ICU, and dialysis is available if the kidneys are affected.',
    prevention: [
      'Wear shoes and carry a torch at night',
      'Use a cot or sleep off the floor, under a mosquito net',
      'Keep the area around the house clear of grass and rubbish'
    ],
    faqs: [
      {
        q: 'Is anti-snake venom available at Pulse Hospital?',
        a: 'Yes. Pulse Hospital, Modasa has a 24x7 emergency team with a snakebite protocol and anti-snake venom. Call ahead on the emergency number while you are on the way.'
      },
      {
        q: 'Should we try to catch or kill the snake?',
        a: 'No. It wastes time and risks another bite. A photo from a safe distance can help, but getting to hospital fast matters most.'
      }
    ],
    review: draft
  },
  {
    slug: 'pesticide-poisoning',
    name: 'Pesticide and drug poisoning',
    nameGu: 'જંતુનાશક દવા અને દવાનું ઝેર',
    alt: ['Poisoning', 'Pesticide poisoning', 'Organophosphate poisoning', 'Drug overdose'],
    department: 'emergency',
    extraDoctorIds: [1, 2],
    facilityIds: ['emergency', 'icu', 'dialysis'],
    summary:
      'Swallowing or breathing in pesticide, or taking too many tablets, is a medical emergency. Bring the person to hospital immediately, along with the bottle or packet of what was taken.',
    summaryGu: 'જંતુનાશક દવા પીવી કે શ્વાસમાં જવી, અથવા વધુ ગોળીઓ લેવી ઇમરજન્સી છે. દર્દીને તરત હોસ્પિટલ લાવો અને દવાની બોટલ કે પેકેટ સાથે લાવો.',
    symptoms: [
      'Vomiting, stomach pain or diarrhoea',
      'Excessive sweating and saliva',
      'Small pupils, blurred vision',
      'Muscle twitching or weakness',
      'Breathlessness',
      'Drowsiness, confusion or unconsciousness'
    ],
    warning: [
      'Do not make the person vomit unless a doctor tells you to',
      'Remove contaminated clothes and wash the skin with water',
      'Bring the container, label or tablet strip to the hospital',
      'Never leave the person alone'
    ],
    causes: [
      'Accidental exposure while spraying crops without protection',
      'Pesticides stored in food or drink bottles at home',
      'Taking more medicine than prescribed',
      'Deliberate self-harm: if someone is thinking about it, talk to them and get help'
    ],
    diagnosis: [
      'Examination and history from the family',
      'Blood tests and arterial blood gas (ABG) in the 24x7 laboratory'
    ],
    treatment:
      'The emergency team stabilises the patient and gives antidotes according to the poison. Many patients need ICU care, sometimes with ventilator support, and dialysis is available for certain poisonings.',
    prevention: [
      'Store pesticides locked, in their original containers, away from children',
      'Wear gloves, a mask and full clothes while spraying',
      'Keep medicines out of reach of children'
    ],
    faqs: [
      {
        q: 'Should we give salt water or milk after poisoning?',
        a: 'No. Do not give anything by mouth or try to make the person vomit. Bring them to hospital quickly with the container of the poison.'
      },
      {
        q: 'Is poisoning treated at Pulse Hospital at night?',
        a: 'Yes. The emergency department and ICU at Pulse Hospital, Modasa work 24x7, with antidote protocols, ventilators and dialysis.'
      }
    ],
    review: draft
  }
];

export const getCondition = (slug) => CONDITIONS.find((c) => c.slug === slug);

/** A condition page is published once a doctor has reviewed it */
export const isPublished = (c) => !!(c && c.review && c.review.by);

export const PUBLISHED_CONDITIONS = CONDITIONS.filter(isPublished);
