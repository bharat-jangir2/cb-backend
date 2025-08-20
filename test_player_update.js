const axios = require('axios');

async function testPlayerUpdate() {
  try {
    const playerId = '68a6005b88d640be7df279aa';
    const updateData = {
      fullName: 'Test Player Updated',
      shortName: 'TPU',
      dob: new Date('1990-01-01'),
      nationality: 'India',
      role: 'BATSMAN',
      battingStyle: 'Right-handed',
      status: 'active'
    };

    console.log('Testing PUT /api/players/' + playerId);
    console.log('Update data:', JSON.stringify(updateData, null, 2));

    const response = await axios.put(`http://localhost:3000/api/players/${playerId}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': 'Bearer YOUR_JWT_TOKEN'
      }
    });

    console.log('✅ Success! Status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testPlayerUpdate();
