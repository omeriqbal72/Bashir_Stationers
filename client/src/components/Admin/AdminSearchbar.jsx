import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../../css/adminSearchbar.css'; // Update the CSS file path
import axios from 'axios';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const AdminSearchbar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const debouncedQuery = useDebounce(query, 1000);
    const [lastTypedTime, setLastTypedTime] = useState(0);
    const [hasTriggeredImmediateFetch, setHasTriggeredImmediateFetch] = useState(false);

    const fetchOptions = useCallback(async (searchTerm) => {
        if (searchTerm.trim() === '') {
            setDropdownOptions([]);
            setDropdownVisible(false);
            return;
        }

        try {
            const response = await axios.get(`/get-search-products?q=${encodeURIComponent(searchTerm)}`);
            const { products, companies, categories, subcategories, productTypes } = response.data;

            const combinedOptions = [
                ...products.map(product => ({ label: product.name, type: 'Product', id: product._id })),
                ...categories.map(category => ({ label: category.name, type: 'Category', id: category._id })),
                ...subcategories.map(subcategory => ({ label: subcategory.name, type: 'Subcategory', id: subcategory._id })),
                ...companies.map(company => ({ label: company.name, type: 'Company', id: company._id })),
                ...productTypes.map(productType => ({ label: productType.name, type: 'ProductType', id: productType._id }))
            ];

            if (combinedOptions.length === 0) {
                setDropdownOptions([{ label: 'No products found', type: 'Message' }]);
            } else {
                setDropdownOptions(combinedOptions);
            }
            setDropdownVisible(true);
        } catch (error) {
            console.error('Failed to fetch options', error);
            setDropdownOptions([{ label: 'Error fetching options', type: 'Message' }]);
            setDropdownVisible(true);
        }
    }, []);

    useEffect(() => {
        if (debouncedQuery.trim().length > 0) {
            fetchOptions(debouncedQuery);
            setHasTriggeredImmediateFetch(true);
        }
    }, [debouncedQuery, fetchOptions]);

    useEffect(() => {
        if (query.length >= 3 && Date.now() - lastTypedTime < 1000 && !hasTriggeredImmediateFetch) {
            fetchOptions(query); 
            setHasTriggeredImmediateFetch(true);
            console.log("Immediate fetch");
        }
    }, [query, lastTypedTime, hasTriggeredImmediateFetch, fetchOptions]);

    useEffect(() => {
        if (query.length === 0) {
            setHasTriggeredImmediateFetch(false);
            setDropdownOptions([]);
            setDropdownVisible(false);
        }
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = (event) => {
        const inputValue = event.target.value;

        if (inputValue.startsWith(' ')) {
            return;
        }

        if (/<\/?[^>]+(>|$)/g.test(inputValue)) {
            setQuery('');
            setHasTriggeredImmediateFetch(false);
            return;
        }

        setQuery(inputValue);
        setLastTypedTime(Date.now());
    };

    const handleKeyDown = (event) => {
        const allResults = [...dropdownOptions];
    
        if (event.key === 'ArrowDown') {
            setSelectedIndex((prevIndex) => (prevIndex + 1) % allResults.length);
        } else if (event.key === 'ArrowUp') {
            setSelectedIndex((prevIndex) =>
                prevIndex === 0 ? allResults.length - 1 : (prevIndex - 1) % allResults.length
            );
        } else if (event.key === 'Enter') {
            if (selectedIndex >= 0 && allResults[selectedIndex]) {
                const selectedResult = allResults[selectedIndex];
                handleOptionClick(selectedResult);
                setDropdownVisible(false);
                setQuery('')
            } else if (query.trim() !== '') {
                handleClickandEnter();
            }
        }
    };
    
    const handleClickandEnter = () => {
        if (query.trim() !== '') {
            onSearch({ search: query });
            setDropdownVisible(false);
            setQuery('');
        } else {
            alert('Enter something');
        }
    };
    
    const handleOptionClick = (option) => {
        setDropdownVisible(false);
        setSelectedIndex(-1);
        if (option.type === 'Message') {
            return;
        }
    
        const searchParams = {
            category: option.type === 'Category' ? option.label : '',
            subcategory: option.type === 'Subcategory' ? option.label : '',
            company: option.type === 'Company' ? option.label : '',
            type: option.type === 'ProductType' ? option.label : '',
            product: option.type === 'Product' ? option.label : '',
        };
    
        onSearch(searchParams);
    };
    
    return (
        <div className="admin-search-bar">
            <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleClickandEnter}>
                <FontAwesomeIcon icon={faSearch} />
            </button>
            {dropdownVisible && (
                <div className="admin-search-bar-dropdown" ref={dropdownRef}>
                    <ul>
                        {dropdownOptions.map((option, index) => (
                            <li key={index}
                                onClick={() => handleOptionClick(option)}
                                className={selectedIndex === index ? 'highlighted' : ''}
                            >
                                {option.label} ({option.type})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AdminSearchbar;
