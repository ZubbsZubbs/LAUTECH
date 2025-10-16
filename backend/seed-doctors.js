const mongoose = require('mongoose');
const Doctor = require('./dist/models/Doctor').default;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lautech-hospital');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample doctors data
const sampleDoctors = [
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@lautech.edu.ng',
    phone: '+2348031234567',
    department: 'Cardiology',
    specialization: 'Interventional Cardiology',
    qualifications: 'MD, PhD, FACC',
    experience: '15 years',
    education: 'Harvard Medical School',
    certifications: ['Board Certified Cardiologist', 'Fellow of American College of Cardiology'],
    languages: ['English', 'French', 'Spanish'],
    status: 'active',
    rating: 4.9,
    patients: 1247,
    appointments: 23,
    image: '/ceo.jpg',
    address: '123 Medical Center Drive, Lagos, Nigeria',
    bio: 'Dr. Sarah Johnson is a renowned cardiologist with over 15 years of experience in interventional cardiology.'
  },
  {
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@lautech.edu.ng',
    phone: '+2348031234568',
    department: 'Pediatrics',
    specialization: 'Pediatric Cardiology',
    qualifications: 'MD, PhD, FAAP',
    experience: '12 years',
    education: 'Johns Hopkins University',
    certifications: ['Board Certified Pediatrician', 'Fellow of American Academy of Pediatrics'],
    languages: ['English', 'Mandarin'],
    status: 'active',
    rating: 4.8,
    patients: 892,
    appointments: 18,
    image: '/cto.jpeg',
    address: '456 Children Hospital Avenue, Lagos, Nigeria',
    bio: 'Dr. Michael Chen specializes in pediatric cardiology and has treated thousands of children with heart conditions.'
  },
  {
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@lautech.edu.ng',
    phone: '+2348031234569',
    department: 'Neurology',
    specialization: 'Movement Disorders',
    qualifications: 'MD, PhD, FAAN',
    experience: '18 years',
    education: 'Stanford University',
    certifications: ['Board Certified Neurologist', 'Fellow of American Academy of Neurology'],
    languages: ['English', 'Spanish'],
    status: 'active',
    rating: 4.9,
    patients: 654,
    appointments: 15,
    image: '/s1.jpg',
    address: '789 Neurology Center, Lagos, Nigeria',
    bio: 'Dr. Emily Rodriguez is a leading expert in movement disorders and neurological conditions.'
  },
  {
    firstName: 'David',
    lastName: 'Thompson',
    email: 'david.thompson@lautech.edu.ng',
    phone: '+2348031234570',
    department: 'Orthopedics',
    specialization: 'Spine Surgery',
    qualifications: 'MD, PhD, FACS',
    experience: '20 years',
    education: 'Mayo Clinic',
    certifications: ['Board Certified Orthopedic Surgeon', 'Fellow of American College of Surgeons'],
    languages: ['English'],
    status: 'active',
    rating: 4.7,
    patients: 1123,
    appointments: 21,
    image: '/s2.jpg',
    address: '321 Orthopedic Center, Lagos, Nigeria',
    bio: 'Dr. David Thompson is a highly skilled orthopedic surgeon specializing in spine surgery.'
  },
  {
    firstName: 'Lisa',
    lastName: 'Wilson',
    email: 'lisa.wilson@lautech.edu.ng',
    phone: '+2348031234571',
    department: 'Ophthalmology',
    specialization: 'Retinal Surgery',
    qualifications: 'MD, PhD, FACS',
    experience: '14 years',
    education: 'University of California San Francisco',
    certifications: ['Board Certified Ophthalmologist', 'Fellow of American College of Surgeons'],
    languages: ['English', 'French'],
    status: 'active',
    rating: 4.8,
    patients: 456,
    appointments: 12,
    image: '/s3.jpg',
    address: '654 Eye Care Center, Lagos, Nigeria',
    bio: 'Dr. Lisa Wilson is an expert in retinal surgery and complex eye conditions.'
  }
];

// Seed function
const seedDoctors = async () => {
  try {
    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');

    // Insert sample doctors
    const doctors = await Doctor.insertMany(sampleDoctors);
    console.log(`Successfully seeded ${doctors.length} doctors`);

    // Display seeded doctors
    doctors.forEach(doctor => {
      console.log(`- ${doctor.name} (${doctor.department})`);
    });

  } catch (error) {
    console.error('Error seeding doctors:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
const runSeed = async () => {
  await connectDB();
  await seedDoctors();
};

runSeed();
