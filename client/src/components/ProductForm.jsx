import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../css/productform.css'; // Import the CSS file

const ProductForm = ({ onProductAdded }) => {
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [type, setType] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);
    const colorDropdownRef = useRef(null);

    const categoryTypes = {
        Pens: ['Gel pens', 'Ball pens', 'Ink pens', 'Ballpoints'],
        'Writing Tools': ['Markers', 'Highlighters', 'Chalk'],
        'Painting Tools': ['Brushes', 'Palettes', 'Acrylic Paints'],
        'Binding Tools': ['Staplers', 'Binders', 'Paper Clips'],
        Pencils: ['HB Pencils', 'Mechanical Pencils'],
        Erasers: ['Rubber Erasers', 'Kneaded Erasers'],
    };

    const companies = ['dux', 'piano', 'dollar', 'casio'];

    const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'];

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setSelectedCategories((prev) =>
            prev.includes(value)
                ? prev.filter((category) => category !== value)
                : [...prev, value]
        );
        setType('');
    };

    const handleColorChange = (e) => {
        const value = e.target.value;
        setSelectedColors((prev) =>
            prev.includes(value)
                ? prev.filter((color) => color !== value)
                : [...prev, value]
        );
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleColorDropdown = () => {
        setIsColorDropdownOpen(!isColorDropdownOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('company', company);
        formData.append('categories', JSON.stringify(selectedCategories));
        formData.append('type', type);
        formData.append('colors', JSON.stringify(selectedColors));
        formData.append('quantity', quantity);
        formData.append('price', price);
        images.forEach((image) => {
            formData.append('images', image);
        });

        try {
            const response = await axios.post('/add-product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                setSuccess('Product added successfully');
                onProductAdded(response.data);
                setName('');
                setCompany('');
                setSelectedCategories([]);
                setType('');
                setPrice('');
                setImages([]);
                setSelectedColors([]);
                setQuantity(0);
                setError('');
            }
        } catch (error) {
            setError('Failed to add product');
            setSuccess('');
        }
    };

    const handleClickOutside = (e) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(e.target)
        ) {
            setIsDropdownOpen(false);
        }
        if (
            colorDropdownRef.current &&
            !colorDropdownRef.current.contains(e.target)
        ) {
            setIsColorDropdownOpen(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="product-form-container">
            <div className="product-form-image">
                <img src="/path/to/your/image.jpg" alt="Product" />
            </div>
            <form onSubmit={handleSubmit} className="product-form">
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Company:</label>
                    <select
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Company</option>
                        {companies.map((comp) => (
                            <option key={comp} value={comp}>
                                {comp}
                            </option>
                        ))}
                    </select>
                </div>

                <div ref={dropdownRef} className="form-group dropdown">
                    <label>Category:</label>
                    <button
                        type="button"
                        className="dropdown-button"
                        onClick={toggleDropdown}
                    >
                        {selectedCategories.length > 0
                            ? selectedCategories.join(', ')
                            : 'Select Categories'}
                    </button>
                    {isDropdownOpen && (
                        <ul className="dropdown-content">
                            {Object.keys(categoryTypes).map((cat) => (
                                <li key={cat}>
                                    <input
                                        type="checkbox"
                                        id={cat}
                                        value={cat}
                                        checked={selectedCategories.includes(cat)}
                                        onChange={handleCategoryChange}
                                    />
                                    <label htmlFor={cat}>{cat}</label>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {selectedCategories.length > 0 && (
                    <div className="form-group">
                        <label>Type:</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Select Type
                            </option>
                            {selectedCategories.flatMap((category) =>
                                categoryTypes[category].map((typ) => (
                                    <option key={typ} value={typ}>
                                        {typ}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                )}

                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Quantity:</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>

                <div ref={colorDropdownRef} className="form-group dropdown">
                    <label>Colors:</label>
                    <button
                        type="button"
                        className="dropdown-button"
                        onClick={toggleColorDropdown}
                    >
                        {selectedColors.length > 0
                            ? selectedColors.join(', ')
                            : 'Select Colors'}
                    </button>
                    {isColorDropdownOpen && (
                        <ul className="dropdown-content">
                            {colors.map((color) => (
                                <li key={color}>
                                    <input
                                        type="checkbox"
                                        id={color}
                                        value={color}
                                        checked={selectedColors.includes(color)}
                                        onChange={handleColorChange}
                                    />
                                    <label htmlFor={color}>{color}</label>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="form-group">
                    <label>Images:</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => setImages(Array.from(e.target.files))}
                    />
                </div>

                <button type="submit" className="submit-button">
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
