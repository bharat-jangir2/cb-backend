const axios = require('axios');

async function testPlayersEndpoint() {
  const baseUrl = 'http://localhost:5000/api/players';
  
  const testCases = [
    {
      name: 'Basic pagination',
      url: `${baseUrl}?page=1&limit=5`
    },
    {
      name: 'With sorting by fullName ascending',
      url: `${baseUrl}?page=1&limit=10&sortBy=fullName&sortOrder=asc`
    },
    {
      name: 'With sorting by fullName descending',
      url: `${baseUrl}?page=1&limit=10&sortBy=fullName&sortOrder=desc`
    },
    {
      name: 'With search term',
      url: `${baseUrl}?page=1&limit=10&search=virat`
    },
    {
      name: 'With all parameters',
      url: `${baseUrl}?page=1&limit=20&sortBy=fullName&sortOrder=asc&search=`
    },
    {
      name: 'Sort by nationality',
      url: `${baseUrl}?page=1&limit=10&sortBy=nationality&sortOrder=asc`
    },
    {
      name: 'Sort by role',
      url: `${baseUrl}?page=1&limit=10&sortBy=role&sortOrder=desc`
    },
    {
      name: 'Filter by nationality (India)',
      url: `${baseUrl}?page=1&limit=10&nationality=india`
    },
    {
      name: 'Filter by role (batsman)',
      url: `${baseUrl}?page=1&limit=10&role=batsman`
    },
    {
      name: 'Filter by status (active)',
      url: `${baseUrl}?page=1&limit=10&status=active`
    },
    {
      name: 'Filter by batting style (Right-handed)',
      url: `${baseUrl}?page=1&limit=10&battingStyle=right`
    },
    {
      name: 'Filter by bowling style (Fast)',
      url: `${baseUrl}?page=1&limit=10&bowlingStyle=fast`
    },
    {
      name: 'Combined filters: nationality + role',
      url: `${baseUrl}?page=1&limit=10&nationality=india&role=batsman`
    },
    {
      name: 'Combined filters: search + nationality + sorting',
      url: `${baseUrl}?page=1&limit=10&search=virat&nationality=india&sortBy=fullName&sortOrder=asc`
    },
    {
      name: 'Complex query with all parameters',
      url: `${baseUrl}?page=1&limit=20&sortBy=fullName&sortOrder=asc&search=&nationality=india&role=batsman&status=active`
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n🧪 Testing: ${testCase.name}`);
      console.log(`URL: ${testCase.url}`);
      
      const response = await axios.get(testCase.url, {
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
        console.log('   - First player:', response.data.data[0].fullName);
      }
      
    } catch (error) {
      console.error(`❌ Error in ${testCase.name}:`, error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
  }
}

testPlayersEndpoint();
