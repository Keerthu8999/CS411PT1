import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, ListGroup } from 'react-bootstrap';
import { debounce } from 'lodash';
import CategoryChart from './CategoryChart';

const CategoryChartWrapper = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showDropdown, setShowDropdown] = useState(true);

    useEffect(() => {
        const fetchCategories = debounce(async (query) => {
            try {
                const response = await axios.get(`http://localhost:8000/api/categories/search?query=${query}`); 
                setCategories(response.data);
                console.log(response.data)
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        }, 300); 

        if (searchTerm) {
            fetchCategories(searchTerm); 
        } else {
            setCategories([]); 
        }
    }, [searchTerm]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category.category_name);
        setShowDropdown(false); 
    };

    const handleReset = () => {
        setSelectedCategory(null);  
        setShowDropdown(true); 
    };

    return (
        <div class="container mt-4">
            <h1>User's Preferred Categories</h1>

            {showDropdown && (
                <>
                    <Form>
                        <Form.Control
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)} 
                        />
                    </Form>

                    <ListGroup className="mt-3">
                        {categories.map(category => (
                            <ListGroup.Item key={category.category_id} onClick={() => handleCategoryClick(category)}>
                                <strong>{category.category_name}</strong>
                                <br />
                                {category.category_description}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </>
            )}

            {selectedCategory && (
                <div>
                    <h2>Category: {selectedCategory}</h2>
                    <CategoryChart selectedCategory={selectedCategory} />
                    <button onClick={handleReset}>Back to Search</button>
                </div>
            )}
        </div>
    );
};

export default CategoryChartWrapper;
