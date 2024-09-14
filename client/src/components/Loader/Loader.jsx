import React from 'react';
import '../../css/loader.css';
import 'ldrs/newtonsCradle';

const Loader = (props) => {

    return (
        <div className='loader' style={{height: `${props.height}vh`}}>
            <l-newtons-cradle
                size="78"
                speed="1.4"
                color="black"
                
            >

            </l-newtons-cradle>
        </div>
    );
};

export default Loader;