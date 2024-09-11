import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../../css/productform.css'; // Import the CSS file
import admin from '../../Ui_Images/admin-panel.jpg'


const ProductForm = ({ onProductAdded }) => {
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
    const colorDropdownRef = useRef(null);

    // Define hierarchical data for categories, subcategories, and types
    const categoryData = {
        'Writing Tools': {
            'Pens': ['Ball pens', 'Gel pens', 'Ink pens'],
            'Pencils': ['Drawing pencil', 'Lead pencil'],
            'Markers': ['Permanent', 'Whiteboard'],
            'Highlighters': ['Fluorescent', 'Pastel'],
        },
        'Art Tools': {
            'Brushes': ['Flat', 'Round'],
            'Palettes': ['Wooden', 'Plastic'],
            'Acrylic Paints': ['Basic Colors', 'Metallic'],
        },
        'Binding Tools': {
            'Staplers': ['Heavy Duty', 'Light Duty'],
            'Binders': ['3-Ring', 'D-Ring'],
            'Paper Clips': ['Standard', 'Colored'],
        },
        'School Supplies': {
            'School Pens': ['Ball pens', 'Gel pens', 'Ink pens'],
            'Pencils': ['Drawing pencil', 'Lead pencil'],
            'Markers': ['Permanent', 'Whiteboard'],
            'Highlighters': ['Fluorescent', 'Pastel'],
            'Brushes': ['Flat', 'Round'],
            'Acrylic Paints': ['Basic Colors', 'Metallic'],
        },

        'Office Supplies': {
            'Office Pens': ['Ball pens', 'Highlighters', 'Ink pens'],
            'Staplers': ['Heavy Duty', 'Light Duty'],
            'Paper Clips': ['Standard', 'Binder Clips'],
            'Office Highlighters': ['Fluorescent', 'Pastel'],
        }
    };

    const companies = ['Dux', 'Piano', 'Dollar', 'Casio'];

    const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'];

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setSelectedCategory(value);
        setSelectedSubCategory('');
        setType('');
    };

    const handleSubCategoryChange = (e) => {
        const value = e.target.value;
        setSelectedSubCategory(value);
        setType('');
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
    };

    const handleColorChange = (e) => {
        const value = e.target.value;
        setSelectedColors((prev) =>
            prev.includes(value)
                ? prev.filter((color) => color !== value)
                : [...prev, value]
        );
    };

    const toggleColorDropdown = () => {
        setIsColorDropdownOpen(!isColorDropdownOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('company', company);
        formData.append('category', selectedCategory);
        formData.append('subCategory', selectedSubCategory);
        formData.append('type', type);
        formData.append('colors', JSON.stringify(selectedColors));
        formData.append('quantity', quantity);
        formData.append('price', price);
        formData.append('description', description); // Added description
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

                // Clear form fields
                setName('');
                setCompany('');
                setSelectedCategory('');
                setSelectedSubCategory('');
                setType('');
                setPrice('');
                setImages([]);
                setSelectedColors([]);
                setQuantity(0);
                setDescription(''); // Clear description
                setError('');
            }
        } catch (error) {
            setError('Failed to add product');
            setSuccess('');
        }
    };

    const handleClickOutside = (e) => {

        if (
            colorDropdownRef.current &&
            !colorDropdownRef.current.contains(e.target)
        ) {
            setIsColorDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="admin-add-product-page-form-container">
            <div className="admin-add-product-page-form-image">
                <img src={admin} alt="Product" />
            </div>
            <form onSubmit={handleSubmit} className="admin-add-product-page-form">
                <div className="admin-add-product-page-form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="admin-add-product-page-form-group">
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

                <div className="admin-add-product-page-form-group">
                    <label>Category:</label>
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        required
                    >
                        <option value="" disabled>Select Category</option>
                        {Object.keys(categoryData).map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedCategory && (
                    <div className="admin-add-product-page-form-group">
                        <label>SubCategory:</label>
                        <select
                            value={selectedSubCategory}
                            onChange={handleSubCategoryChange}
                            required
                        >
                            <option value="" disabled>Select SubCategory</option>
                            {Object.keys(categoryData[selectedCategory]).map((subCat) => (
                                <option key={subCat} value={subCat}>
                                    {subCat}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedSubCategory && (
                    <div className="admin-add-product-page-form-group">
                        <label>Type:</label>
                        <select
                            value={type}
                            onChange={handleTypeChange}
                            
                        >
                            <option value="" disabled>Select Type</option>
                            {categoryData[selectedCategory][selectedSubCategory]?.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="admin-add-product-page-form-group">
                    <label>Price:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>

                <div className="admin-add-product-page-form-group">
                    <label>Quantity:</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                            const value = e.target.value;
                            setQuantity(value.startsWith('0') ? value.replace(/^0+/, '') : value);
                        }}
                        required
                    />
                </div>


                <div className="admin-add-product-page-form-group">
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="admin-add-product-page-form-group">
                    <label>Colors:</label>
                    <button type="button" onClick={toggleColorDropdown}>
                        {selectedColors.length ? selectedColors.join(', ') : 'Select Colors'}
                    </button>
                    {isColorDropdownOpen && (
                        <ul ref={colorDropdownRef} className="color-dropdown">
                            {colors.map((color) => (
                                <li key={color}>
                                    <input
                                        type="checkbox"
                                        value={color}
                                        checked={selectedColors.includes(color)}
                                        onChange={handleColorChange}
                                    />
                                    {color}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="admin-add-product-page-form-group">
                    <label>Images:</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => setImages(Array.from(e.target.files))}
                        required
                    />
                </div>

                <button type="submit">Add Product</button>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </form>

        </div>
    );
};

export default ProductForm;
