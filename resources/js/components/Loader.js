import React, {Component} from 'react';

class Loader extends Component{

    render(){
        return(
            <div className="back-loader"><div className="lds-hourglass" /></div>
        )
    }
}

export default Loader;