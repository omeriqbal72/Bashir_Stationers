import React from 'react';


const ColorSelector = ({ colors, selectedColors, setSelectedColors }) => {
    const handleColorChange = (color) => {
        setSelectedColors((prev) =>
            prev.includes(color)
                ? prev.filter((c) => c !== color)
                : [...prev, color]
        );
    };

    return (
        <div className="admin-add-product-page-form-group">
            <label>
                Colors:
                <div className="edit-product-page-color-selection">
                    {colors.map((color, index) => (
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
        </div>
    );
};

export default ColorSelector;
