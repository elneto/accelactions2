import React from 'react';

function Select(props){
    const options = 
      props.options.map( option => {
        let key = Object.keys(option)[0];
        let val = option[key];
        return <option key={key} value={key}>{val}</option>
        }
      );
    return(
    <select value={props.value} onChange={props.onChange}>
      {options}
    </select>
    )
}

export default Select;