// Master.js

import React, {Component} from 'react';
import {Link} from 'react-router';
import axios from 'axios';
import {Alert} from 'reactstrap';
import DisplayVideo from './DisplayVideo';
import CreateVideo from './CreateVideo';
import Loader from './Loader';

class Master extends Component {

    constructor(props) {
        super(props);

        this.state = {
            videos: [],
            isLoading: false,
            visible: false,
            alertMessage: ''
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.showAlert = this.showAlert.bind(this);
    }

    onDismiss() {
        this.setState({visible: false})
    }

    showAlert(action) {
        this.setState({
            visible: true,
            alertMessage: action
        });
    }

    async componentDidMount() {
        const res = await axios.get('/videos').catch(error => console.log(error));
        if (res.data.items) {
            this.setState({
                videos: res.data.items,
                isLoading: true
            });
        } else {
            this.setState({
                isLoading: true
            });
        }
    }

    renderVideos() {
        const {isLoading, videos} = this.state;
        if (isLoading && videos.length > 0) {
            console.log(this.state.videos);
            return <DisplayVideo
                videos={this.state.videos}
                getVideos={this.componentDidMount}
                showAlert={this.showAlert}
            />
        } else if (isLoading) {
            return <p className="empty-video">Video is not found!</p>
        } else {
            return <Loader/>
        }
    }

    render() {
        return (
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <Link className="navbar-brand" to="/">YouTube</Link>
                        </div>
                        <ul className="navbar-nav">
                        </ul>
                    </div>
                </nav>
                <div>
                    <Alert color="success" isOpen={this.state.visible} toggle={this.onDismiss}>
                        {this.state.alertMessage} is successfully!
                    </Alert>

                    <h1>Videos in Channel</h1>
                    <CreateVideo getVideos={this.componentDidMount} showAlert={this.showAlert}/>
                    {this.renderVideos()}
                </div>
            </div>
        )
    }
}

export default Master;