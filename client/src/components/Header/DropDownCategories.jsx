import React, { useState } from 'react';
import '../../css/dropdowncategories.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl } from '@fortawesome/free-solid-svg-icons';

const DropdownMenu = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    return (
        <div
            className="dropdown-container"
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
        >
            <FontAwesomeIcon icon={faListUl} />
            <button className="dropdown-button">Browse Categories</button>
            {isDropdownVisible && (
                <div className="dropdown-content">
                    <ul>
                        <li>Calculators</li>
                        <li>Conference Pad</li>
                        <li>Files & Folders</li>
                        <li>Artist Supplies</li>
                        <li>School Supplies</li>
                        <li>Tools</li>
                        <li>Photo Paper</li>
                        <li>Notebooks</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
