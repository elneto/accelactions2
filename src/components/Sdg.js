import React from 'react';
import SDGCOLORS from '../constants';

function Sdg(props){
    const sdg = props.goal;  

    const style={
        padding:"0.2em 0.3em", 
        marginRight: "2px",
        marginBottom: "4px",
        width: "1.8em",
        display: "inline-block",
        textAlign: "center",
        backgroundColor: SDGCOLORS[sdg],
        color: "white"
    }

    return(
        <a href={"https://sustainabledevelopment.un.org/sdg"+sdg} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
            <span style={style}>{sdg}</span>
        </a>
    )

}

export default Sdg;