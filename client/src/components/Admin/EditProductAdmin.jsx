import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/editProduct.css';

const categoryData = {
    'Writing Tools': {
        'Pens': ['Ball pens', 'Gel pens', 'Ink pens'],
        'Pencils': ['Drawing pencil', 'Lead pencil'],
        'Markers': ['Permanent', 'Whiteboard'],
        'Highlighters': ['Fluorescent', 'Pastel'],
    },
    'Painting Tools': {
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
            'Pens': ['Ball pens', 'Gel pens', 'Ink pens'],
            'Pencils': ['Drawing pencil', 'Lead pencil'],
            'Markers': ['Permanent', 'Whiteboard'],
            'Highlighters': ['Fluorescent', 'Pastel'],
            'Brushes': ['Flat', 'Round'],
            'Acrylic Paints': ['Basic Colors', 'Metallic'],
        },

        'Office Supplies': {
            'Pens': ['Ball pens', 'Gel pens', 'Ink pens'],
            'Staplers': ['Heavy Duty', 'Light Duty'],
            'Paper Clips': ['Standard', 'Colored'],
            'Highlighters': ['Fluorescent', 'Pastel'],
        },
};

const companies = ['dux', 'piano', 'dollar', 'casio'];
const availablecolors = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'];

const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [type, setType] = useState('');
    const [selectedColors, setSelectedColors] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/admin/edit-product/${id}`);
                const productData = response.data;
                setProduct(productData);
                setSelectedCategory(productData.category.name || '');
                setSelectedSubCategory(productData.subCategory.name || '');
                setType(productData.type.name || '');
                console.log(type)
                setSelectedColors(productData.colors || []);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "companyName") {
            setProduct(prevState => ({
                ...prevState,
                company: { name: value }
            }));
            
        }
        else if (name === "description") {
            setProduct(prevState => ({
                ...prevState,
                description: value
            }));
        } else {
            setProduct(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setSelectedCategory(value);
        setSelectedSubCategory(''); // Reset subcategory and type
        setType('');
    };

    const handleSubCategoryChange = (e) => {
        const value = e.target.value;
        setSelectedSubCategory(value);
        setType(''); // Reset type
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

   

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('name', product.name);
            formData.append('price', product.price);
            formData.append('companyName', product.company?.name || '');
            formData.append('quantity', product.quantity);
            formData.append('colors', JSON.stringify(selectedColors));
            formData.append('description' , product.description)
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
        navigate('/admin');
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div className="edit-product-page-container">
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
                <div className="admin-edit-product-page-form-group">
                    <label>Category:</label>
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        disabled
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
                    <div className="admin-edit-product-page-form-group">
                        <label>SubCategory:</label>
                        <select
                            value={selectedSubCategory}
                            onChange={handleSubCategoryChange}
                            disabled
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
                    <div className="admin-edit-product-page-form-group">
                        <label>Type:</label>
                        <select
                            value={type}
                            onChange={handleTypeChange}
                            disabled
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
                    <div className="edit-product-page-color-selection">
                        {availablecolors.map((color, index) => (
                            <div
                                key={index}
                                className={`edit-product-page-color-box ${selectedColors.includes(color) ? 'selected' : ''}`}
                                style={{ backgroundColor: color.toLowerCase() }}
                                onClick={() => handleColorChange(color)}
                            >
                            </div>
                        ))}
                    </div>
                </label>

                <label>
                    Description:
                    <textarea
                        
                        value={product.description || ''}
                        onChange={handleChange}
                    />
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
                    <div className="edit-product-page-existing-images">
                        {product.images && product.images.map((image, index) => (
                            <div key={index} className="edit-product-page-image-container">
                                <img
                                    src={`http://localhost:8080/${image}`}
                                    alt={`${product.name} ${index + 1}`}
                                    className="edit-product-page-image"
                                />
                                <button
                                    type="button"
                                    className="edit-product-page-remove-button"
                                    onClick={() => handleRemoveImage(image)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </label>
                <div>
                    <button type="button" className="edit-product-page-save-button" onClick={handleSubmit}>Save</button>
                    <button type="button" className="edit-product-page-cancel-button" onClick={handleCancel}>Cancel</button>
                </div>

            </form>
        </div>
    );
};

export default EditProductPage;
