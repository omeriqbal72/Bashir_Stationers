import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../../css/searchbar.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Debounce function to limit API calls
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

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({
        products: [],
        companies: [],
        categories: [],
        subcategories: [],
        productTypes: []
    });
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [lastTypedTime, setLastTypedTime] = useState(0);
    const [hasTriggeredImmediateFetch, setHasTriggeredImmediateFetch] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const debouncedQuery = useDebounce(query, 1000);
    // Memoized fetchResults function
    const fetchResults = useCallback(async (searchTerm) => {
        try {
            const response = await axios.get(`/get-search-products?q=${searchTerm}`);
            if (response.status === 200) {
                setResults(response.data);
                setDropdownVisible(true);
            } else {
                console.error('Error fetching search results:', response.status);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }, []);

    useEffect(() => {
        if (debouncedQuery.trim().length > 0) {
            fetchResults(debouncedQuery);
            setHasTriggeredImmediateFetch(true);
        }
    }, [debouncedQuery, fetchResults]);

    useEffect(() => {
        if (query.length >= 3 && Date.now() - lastTypedTime < 1000 && !hasTriggeredImmediateFetch) {
            fetchResults(query);
            setHasTriggeredImmediateFetch(true);
        }
    }, [query, lastTypedTime, hasTriggeredImmediateFetch, fetchResults]);


    useEffect(() => {
        if (query.length === 0) {
            setHasTriggeredImmediateFetch(false);
            setResults({
                products: [],
                companies: [],
                categories: [],
                subcategories: [],
                productTypes: []
            });
            setDropdownVisible(false);
        }
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
                setSelectedIndex(-1);
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

    const handleClick = (result) => {
        setDropdownVisible(false);
        navigateToSelectedItem(result);
        setSelectedIndex(-1);
        setQuery('');
    };

    const handleKeyDown = (event) => {
        const allResults = [
            ...results.products,
            ...results.companies,
            ...results.categories,
            ...results.subcategories,
            ...results.productTypes
        ];

        if (event.key === 'ArrowDown') {
            setSelectedIndex((prevIndex) => (prevIndex + 1) % allResults.length);
        } else if (event.key === 'ArrowUp') {
            setSelectedIndex((prevIndex) =>
                prevIndex === 0 ? allResults.length - 1 : (prevIndex - 1) % allResults.length
            );
        } else if (event.key === 'Enter') {
            if (selectedIndex >= 0 && allResults[selectedIndex]) {
                // Handle the case where an item is selected
                const selectedResult = allResults[selectedIndex];
                navigateToSelectedItem(selectedResult);
                setSelectedIndex(-1);
                setDropdownVisible(false);
                setQuery('');
            } else {
                handleClickandEnter()

            }
        }
    };

    const handleClickandEnter = () => {
        if (query !== '') {
            navigate(`/products?search=${encodeURIComponent(query)}`);
            setQuery('');
            setDropdownVisible(false);
        }
        else {
            alert('Enter Something')
        }

    }

    const navigateToSelectedItem = (result) => {
        const encodedName = encodeURIComponent(result.name);
        switch (result.type) {
            case 'product':
                navigate(`/products?product=${encodedName}`);
                break;
            case 'company':
                navigate(`/products?company=${encodedName}`);
                break;
            case 'category':
                navigate(`/products?category=${encodedName}`);
                break;
            case 'subcategory':
                navigate(`/products?subcategory=${encodedName}`);
                break;
            case 'productType':
                navigate(`/products?type=${encodedName}`);
                break;
            default:
                break;
        }
    };

    const allResults = [
        ...results.products,
        ...results.companies,
        ...results.categories,
        ...results.subcategories,
        ...results.productTypes
    ];

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            <button onClick={() => handleClickandEnter()}>
                <FontAwesomeIcon icon={faSearch} />
            </button>
            {isDropdownVisible && allResults.length > 0 && (
                <div className="search-dropdown" ref={dropdownRef}>
                    {results.products.length > 0 && (
                        <div className="search-results-section">
                            <div className="search-results-heading">
                                <h4>Products</h4>
                            </div>

                            {results.products.map((product, index) => (

                                <div
                                    key={product._id}
                                    className={`search-dropdown-item ${selectedIndex === index ? 'selected' : ''}`}
                                    onClick={() => handleClick(product)}>
                                    <div>
                                        {product.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {results.companies.length > 0 && (
                        <div className="search-results-section">
                            <div className="search-results-heading">
                                <h4>Company</h4>
                            </div>
                            {results.companies.map((company, index) => (


                                <div
                                    key={company._id}
                                    className={`search-dropdown-item ${selectedIndex === results.products.length + index ? 'selected' : ''}`}
                                    onClick={() => handleClick(company)}>
                                    <div>
                                        {company.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {results.categories.length > 0 && (
                        <div className="search-results-section">
                            <div className="search-results-heading">
                                <h4>Category</h4>
                            </div>
                            {results.categories.map((category, index) => (
                                <div key={category._id}
                                    className={`search-dropdown-item ${selectedIndex === results.products.length + results.companies.length + index ? 'selected' : ''}`}
                                    onClick={() => handleClick(category)}>
                                    <div>
                                        {category.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {results.subcategories.length > 0 && (
                        <div className="search-results-section">
                            <div className="search-results-heading">
                                <h4>Subcategory</h4>
                            </div>
                            {results.subcategories.map((subcategory, index) => (
                                <div key={subcategory._id}
                                    className={`search-dropdown-item ${selectedIndex === results.products.length + results.companies.length + results.categories.length + index ? 'selected' : ''}`}
                                    onClick={() => handleClick(subcategory)}>
                                    <div>
                                        {subcategory.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {results.productTypes.length > 0 && (
                        <div className="search-results-section">
                            <div className="search-results-heading">
                                <h4>Product Type</h4>
                            </div>
                            {results.productTypes.map((type, index) => (
                                <div key={type._id}
                                    className={`search-dropdown-item ${selectedIndex === results.products.length + results.companies.length + results.categories.length + results.subcategories.length + index ? 'selected' : ''}`}
                                    onClick={() => handleClick(type)}>
                                    <div>
                                        {type.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
