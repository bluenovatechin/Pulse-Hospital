// Sends one sample "new appointment" WhatsApp message using the settings in
// server/.env (or the host's environment). Run:  npm run test:whatsapp
await import('../loadEnv.js');
const { notifyStaffOfAppointment } = await import('../services/whatsappService.js');

const sample = {
  id: 'PLS-TEST01',
  patientName: 'Test Patient',
  patientPhone: '9800000000',
  patientAge: 40,
  patientGender: 'Male',
  city: 'Modasa',
  doctorName: 'Dr. Dipesh S. Patel',
  doctorSpecialty: 'Consultant Physician & Critical Care',
  date: new Date().toISOString().slice(0, 10),
  timeSlot: '10:00 AM - 10:30 AM',
  room: 'OPD Suite 401',
  symptoms: 'This is a test message from the Pulse Hospital website',
  bookedBy: 'Patient',
  bookedByName: 'Self (Online)'
};

const result = await notifyStaffOfAppointment(sample);
console.log(result.sent ? `✅ Sent to ${result.sentTo.join(', ')}` : `❌ Not sent: ${result.error}`);
process.exit(result.sent ? 0 : 1);
