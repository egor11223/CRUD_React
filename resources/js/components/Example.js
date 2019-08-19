// Example.js

import React, { Component } from 'react';

export default class Example extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 col-md-offset-2">
                        <div className="panel panel-default">
                            <div className="panel-heading">Example Component</div>

                            <div className="panel-body">
                                I am an example component!
                            </div>

                            <button type="button" className="btn btn-outline-primary">Primary</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}