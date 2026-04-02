require('dotenv').config({ path: '.env.local' });

async function testSubmit() {
    const testData = {
        name: 'Test Buyer',
        email: 'test@example.com',
        phone: '+971501234567',
        purpose: 'Buy',
        category: 'Residential',
        sub_category: 'Villa',
        emirate: 'Dubai',
        preferred_areas: 'Dubai Marina',
        bedrooms: '3',
        bathrooms: '2',
        min_size_sqft: '',
        max_size_sqft: '',
        maid_room: '',
        furnishing: '',
        min_budget: '2000000',
        max_budget: '3000000',
        payment_method: '',
        additional_requirements: ''
    };

    try {
        console.log('Testing buyer requirements submission...');
        console.log('API URL:', 'http://localhost:8001/buyer-requirements');
        
        const response = await fetch('http://localhost:8001/buyer-requirements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        console.log('Response status:', response.status);
        
        const text = await response.text();
        console.log('Response text:', text);
        
        try {
            const data = JSON.parse(text);
            console.log('Response data:', data);
            
            if (data.success) {
                console.log('✅ Success! ID:', data.id);
            } else {
                console.log('❌ Failed:', data.error);
            }
        } catch (e) {
            console.log('❌ Response is not JSON:', text);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testSubmit();
