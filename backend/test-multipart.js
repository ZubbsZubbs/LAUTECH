const FormData = require('form-data');
const fetch = require('node-fetch');

async function testMultipart() {
  const form = new FormData();
  
  // Add form fields
  form.append('firstName', 'Test');
  form.append('lastName', 'User');
  form.append('email', 'test@example.com');
  form.append('phoneNumber', '1234567890');
  form.append('dateOfBirth', '1990-01-01');
  form.append('gender', 'Male');
  form.append('nationality', 'Nigeria');
  form.append('stateOfOrigin', 'Lagos');
  form.append('lga', 'Ikeja');
  form.append('address', 'Test Address');
  form.append('program', 'BSc Nursing');
  form.append('jambScore', '250');
  form.append('jambRegNumber', '1234567890');
  form.append('olevelResults', 'A1');
  form.append('olevelYear', '2020');
  form.append('bloodGroup', 'A+');
  form.append('genotype', 'AA');
  form.append('emergencyName', 'Emergency Contact');
  form.append('emergencyPhone', '0987654321');
  form.append('emergencyRelationship', 'Parent');
  form.append('emergencyAddress', 'Emergency Address');
  form.append('motivation', 'Test motivation');
  form.append('careerGoals', 'Test career goals');
  form.append('references', JSON.stringify({
    referee1: {
      name: 'Referee 1',
      phone: '1111111111',
      email: 'ref1@example.com',
      relationship: 'Teacher'
    },
    referee2: {
      name: 'Referee 2',
      phone: '2222222222',
      email: 'ref2@example.com',
      relationship: 'Mentor'
    }
  }));

  try {
    const response = await fetch('https://localhost:9000/api/applications/nursing', {
      method: 'POST',
      body: form
    });

    const result = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testMultipart();




