import React from 'react';
import Sdg from './Sdg.js';

function CommitmentFeatured(props){
  const com = props.commitment;
  //TODO an SDG component and map it
    return(    
      
      <div className="col-md-6">
        <div className="commitment">
            <a href={"https://sustainabledevelopment.un.org/partnership/?p=" + com.commitment_nr} 
            target="_blank" rel="noopener noreferrer">
            <h4 className="comTitle">{com.title}</h4>
            </a>
            <div dangerouslySetInnerHTML={com.intro}></div>
            <h4>Organization</h4>
            <p>{com.leadorg}</p>
            {/* <h4>Partners</h4>
            <div dangerouslySetInnerHTML={com.partners}></div> */}
            <h4>SDGs</h4>
            <p>{com.goals.map(goal => 
            <Sdg key={goal} goal={goal}/>
            )}</p>
        </div>
      </div>
      
      )
  }

export default CommitmentFeatured;