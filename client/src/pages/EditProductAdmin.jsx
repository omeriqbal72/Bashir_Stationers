import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/editProduct.css'


const availableColors = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Purple'];
const categories = ['Pens', 'Writing Tools', 'Painting Tools', 'Binding Tools', 'Pencils', 'Erasers'];
const categoryTypes = {
    Pens: ['Gel pens', 'Ball pens', 'Ink pens', 'Ballpoints'],
    'Writing Tools': ['Markers', 'Highlighters', 'Chalk'],
    'Painting Tools': ['Brushes', 'Palettes', 'Acrylic Paints'],
    'Binding Tools': ['Staplers', 'Binders', 'Paper Clips'],
    Pencils: ['HB Pencils', 'Mechanical Pencils'],
    Erasers: ['Rubber Erasers', 'Kneaded Erasers'],
};
const companies = ['dux', 'piano', 'dollar', 'casio'];

const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [availableTypes, setAvailableTypes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/admin/edit-product/${id}`);
                const productData = response.data;
                setProduct(productData);
                setSelectedCategories(productData.categories.map(cat => cat.name) || []);
                setAvailableTypes(categoryTypes[productData.categories[0]?.name] || []);
                setSelectedColors(productData.colors || []);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        const updatedCategories = checked
            ? [...selectedCategories, value]
            : selectedCategories.filter(category => category !== value);

        setSelectedCategories(updatedCategories);
        setAvailableTypes(categoryTypes[updatedCategories[0]] || []);

        setProduct(prevState => ({
            ...prevState,
            categories: updatedCategories.map(name => ({ name }))
        }));
    };

    const handleTypeChange = (e) => {
        const selectedType = e.target.value;
        setProduct(prevState => ({
            ...prevState,
            type: { name: selectedType }
        }));
    };

    const handleColorChange = (color) => {
        setSelectedColors(prevColors =>
            prevColors.includes(color)
                ? prevColors.filter(c => c !== color)
                : [...prevColors, color]
        );
        setProduct(prevState => ({
            ...prevState,
            colors: selectedColors
        }));
    };

    const handleFileChange = (e) => {
        setNewImages(Array.from(e.target.files));
    };

    const handleRemoveImage = (imageToRemove) => {
        setRemovedImages(prev => [...prev, imageToRemove]);
        setProduct(prevState => ({
            ...prevState,
            images: prevState.images.filter(img => img !== imageToRemove)
        }));
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('name', product.name);
            formData.append('price', product.price);
            formData.append('companyName', product.company?.name || '');
            formData.append('categories', JSON.stringify(selectedCategories));
            formData.append('typeName', product.type?.name || '');
            formData.append('quantity', product.quantity);
            formData.append('colors', JSON.stringify(selectedColors));
            newImages.forEach(image => formData.append('images', image));
            formData.append('removedImages', removedImages.join(','));

            const response = await axios.put(`/edit-product/${product._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Handle successful save
            console.log('Product updated successfully:', response.data);
            navigate('/admin');
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    const handleCancel = () => {
        // Redirect or reset as needed
        navigate('/admin');
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div className="edit-product-page">
            <h2>Edit Product</h2>
            <form>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={product.name || ''}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Price:
                    <input
                        type="number"
                        name="price"
                        value={product.price || ''}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Company:
                    <select
                        name="companyName"
                        value={product.company?.name || ''}
                        onChange={handleChange}
                    >
                        {companies.map((company, index) => (
                            <option key={index} value={company}>{company}</option>
                        ))}
                    </select>
                </label>
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

                <label>
                    Type:
                    <select
                        name="typeName"
                        value={product.type?.name || ''}
                        onChange={handleTypeChange}
                        disabled={selectedCategories.length === 0}
                    >
                        {availableTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Quantity:
                    <input
                        type="number"
                        name="quantity"
                        value={product.quantity || ''}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Colors:
                    <div className="color-selection">
                        {availableColors.map((color, index) => (
                            <div
                                key={index}
                                className={`color-box ${selectedColors.includes(color) ? 'selected' : ''}`}
                                style={{ backgroundColor: color.toLowerCase() }}
                                onClick={() => handleColorChange(color)}
                            >     
                            </div>
                        ))}
                    </div>
                </label>
                <label>
                    New Images:
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                    />
                </label>
                <label>
                    Existing Images:
                    <div>
                        {product.images && product.images.map((image, index) => (
                            <div key={index} style={{ display: 'inline-block', margin: '5px' }}>
                                <img
                                    src={`http://localhost:8080/${image}`}
                                    alt={`${product.name} ${index + 1}`}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(image)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </label>
                <button type="button" onClick={handleSubmit}>Save</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );
};

export default EditProductPage;
