import axios from 'axios';

export const callTestAPI = async () => {
    try {
        const response = await axios.get('http://localhost:8080/test');
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
