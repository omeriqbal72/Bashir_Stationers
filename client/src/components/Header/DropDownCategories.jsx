import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../css/dropdowncategories.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, Menu } from 'antd';

const DropDownCategories = () => {
    const [categories, setCategories] = useState([]);
    
    useEffect(() => {
        // Replace the URL with your actual API endpoint
        axios.get('/get-categories')
            .then(response => {
                setCategories(response.data);
                //console.log(response.data); // Uncomment this line to debug
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    // Map categories and subcategories to the format expected by the Menu component
    const items = categories.map(category => ({
        key: category._id,
        label: (
            <Link to={`/products?category=${encodeURIComponent(category.name)}`}>
                {category.name}
            </Link>
        ),
        children: category.subcategories.map(sub => ({
            key: sub._id,
            label: (
            <Link to={`/products?subcategory=${encodeURIComponent(sub.name)}`}>
                {sub.name}
            </Link>
        )
        })),
    }));

    return (
        <Dropdown
            menu={{
                items
            }}
        >
            <div className="dropdown-container">
                <FontAwesomeIcon icon={faListUl} />
                <button className="dropdown-button">Browse Categories</button>
            </div>

        </Dropdown>
    );
}

export default DropDownCategories;
