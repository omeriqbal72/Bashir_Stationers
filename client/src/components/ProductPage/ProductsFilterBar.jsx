import React from 'react';
import '../../css/productsfilterbar.css'
import FiltersDropDown from './FiltersDropDown.jsx';

function ProductsFilterBar(props) {

  const BrandOptions = [
    {
      value: 'Dux',
      label: 'Dux',
    },
    {
      value: 'Dollar',
      label: 'Dollar',
    },
    {
      value: 'Piano',
      label: 'Piano',
    },
    {
      value: 'Casio',
      label: 'Casio',
    },
  ]

  const PriceOptions = [
    {
      value: 0,
      label: 'Rupees',
      disabled: true
    },
    {
      value: '0 - 250',
      label: '0 - 250',
    },
    {
      value: '250 - 500',
      label: '250 - 500',
    },
    {
      value: '500 - 1000',
      label: '500 - 1000',
    },
    {
      value: '1000 - 2500',
      label: '1000 - 2500',
    },
    {
      value: '2500 - 5000',
      label: '2500 - 5000',
    },
    {
      value: '5000 - 999999',
      label: '5000+',
    }
  ]

  return (
    <div className="filter-bar">
      <div className='product-search-results'>
        <h3>Search Results ({props.length})</h3>
        <span>Viewing {props.length} out of {props.total} products</span>
      </div>
      <div className="filter-section">
        <span>Filter By:</span>
        <FiltersDropDown placeholder={'Brand'} options={BrandOptions} onChange={props.onBrandChange} />
        <FiltersDropDown placeholder={'Price'} options={PriceOptions} onChange={props.onPriceChange} />
      </div>

    </div>
  );
}

export default ProductsFilterBar;
