const axios = require('axios');

async function testSpecificUrl() {
  const url = 'http://localhost:5000/api/players?page=1&limit=20&sortBy=fullName&sortOrder=asc&search=&nationality=india';
  
  try {
    console.log('🧪 Testing specific URL:');
    console.log(url);
    
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': 'Bearer YOUR_JWT_TOKEN'
      }
    });

    console.log('✅ Success! Status:', response.status);
    console.log('📊 Response summary:');
    console.log(`   - Total players: ${response.data.total}`);
    console.log(`   - Current page: ${response.data.page}`);
    console.log(`   - Items per page: ${response.data.limit}`);
    console.log(`   - Total pages: ${response.data.totalPages}`);
    console.log(`   - Has next: ${response.data.hasNext}`);
    console.log(`   - Has prev: ${response.data.hasPrev}`);
    console.log(`   - Players returned: ${response.data.data.length}`);
    
    if (response.data.data.length > 0) {
      console.log('\n📋 First few players:');
      response.data.data.slice(0, 3).forEach((player, index) => {
        console.log(`   ${index + 1}. ${player.fullName} (${player.nationality}) - ${player.role}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testSpecificUrl();
