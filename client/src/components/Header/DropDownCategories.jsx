import React, { useState } from 'react';
import '../../css/dropdowncategories.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, Space } from 'antd';

const DropDownCategories = () => {

    const items = [
        {
            key: '1',
            label: 'Art Supplies',
            children: [
                {
                    key: '1-1',
                    label: '3rd menu item',
                },
                {
                    key: '1-2',
                    label: '4th menu item',
                },
            ],
        },
        {
            key: '2',
            label: 'Craft Supplies',
            children: [
                {
                    key: '2-1',
                    label: '3rd menu item',
                },
                {
                    key: '2-2',
                    label: '4th menu item',
                },
            ],
        },
        {
            key: '3',
            label: 'Office Supplies',
            children: [
                {
                    key: '2-1',
                    label: '3rd menu item',
                },
                {
                    key: '2-2',
                    label: '4th menu item',
                },
            ],
        },
        {
            key: '4',
            label: 'Organizers',
            children: [
                {
                    key: '2-1',
                    label: '3rd menu item',
                },
                {
                    key: '2-2',
                    label: '4th menu item',
                },
            ],
        },
        {
            key: '5',
            label: 'Paper Products',
            children: [
                {
                    key: '2-1',
                    label: '3rd menu item',
                },
                {
                    key: '2-2',
                    label: '4th menu item',
                },
            ],
        },
        {
            key: '6',
            label: 'Presentation Tools',
            children: [
                {
                    key: '2-1',
                    label: '3rd menu item',
                },
                {
                    key: '2-2',
                    label: '4th menu item',
                },
            ],
        },
        {
            key: '7',
            label: 'School Supplies',
            children: [
                {
                    key: '2-1',
                    label: '3rd menu item',
                },
                {
                    key: '2-2',
                    label: '4th menu item',
                },
            ],
        },
        {
            key: '8',
            label: 'Writing Tools',
            children: [
                {
                    key: '2-1',
                    label: '3rd menu item',
                },
                {
                    key: '2-2',
                    label: '4th menu item',
                },
            ],
        },

    ];

    return (

        <Dropdown
            menu={{
                items,
            }}
        >
                <div className="dropdown-container">
                     <FontAwesomeIcon icon={faListUl} />
                    <button className="dropdown-button">Browse Categories</button>
                    {/* <DownOutlined /> */}
                </div>
            
        </Dropdown>
    );
}
export default DropDownCategories;
