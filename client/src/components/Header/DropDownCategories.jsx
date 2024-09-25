import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl } from '@fortawesome/free-solid-svg-icons';
import '../../css/dropdowncategories.css';

const DropDownCategories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('/get-categories')
            .then(response => {
                const data = Array.isArray(response.data) ? response.data : [];
                setCategories(data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const items = Array.isArray(categories) ? categories.map(category => ({
        key: category._id,
        label: (
            <Link to={`/products?category=${encodeURIComponent(category.name)}`}>
                {category.name}
            </Link>
        ),
        children: Array.isArray(category.subcategories) ? category.subcategories.map(sub => ({
            key: sub._id,
            label: (
                <Link to={`/products?subcategory=${encodeURIComponent(sub.name)}`}>
                    {sub.name}
                </Link>
            )
        })) : []
    })) : [];
    

    return (
        <Dropdown
            overlay={<Menu items={items} />}
        >
            <div className="dropdown-container">
                <FontAwesomeIcon icon={faListUl} />
                <button className="dropdown-button">Browse Categories</button>
            </div>
        </Dropdown>
    );
};

export default DropDownCategories;
