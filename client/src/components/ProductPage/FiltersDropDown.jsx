import React from 'react';
import { Select, Space } from 'antd';

const FiltersDropDown = (props) => (
    <Space wrap>
        <Select
            style={{
                width: 120,
            }}
            allowClear
            options={props.options}
            placeholder={props.placeholder}
            onChange={props.onChange}
        />
    </Space>
);
export default FiltersDropDown;