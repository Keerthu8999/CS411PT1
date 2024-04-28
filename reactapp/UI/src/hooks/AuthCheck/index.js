import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthCheck = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log(token);
        console.log(`Does it come into hook?`)
        // Optionally, check if the token is expired or invalid. This might require an API call.
        if (token) {
            navigate('/main');  // Redirect to the main app if token exists
        } else {
            navigate('/login');  // Redirect to login if no token or token is invalid
        }
    }, [navigate]);

    return null;
};

export default useAuthCheck;