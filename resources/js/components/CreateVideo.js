// CreateItem.js

import React, {Component} from 'react';
import {Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

class CreateVideo extends Component {
    constructor(state){
        super(state);

        this.state = {
            modal: false,
            form: false
        };

        this.toggle = this.toggle.bind(this);
        this.createVideo = this.createVideo.bind(this);
    }

    async createVideo(e){
        e.preventDefault();

        this.setState({
           form: !this.state.form
        });

        let formData = new FormData();

        formData.append('name', e.target.elements.Title.value);
        formData.append('description', e.target.elements.Description.value);
        formData.append('video', e.target.elements.Video.files[0]);

        const response = await axios.post('/insert', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log(response);
        await setTimeout(() => {this.props.getVideos()}, 10000);
        await this.toggle();
        await this.props.showAlert('Create');
        this.setState({
            form: !this.state.form
        });
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        return (
            <div>
                <Button color="success" onClick={this.toggle} className="create-video">Create Video</Button>

                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <form onSubmit={this.createVideo} >
                        <ModalHeader toggle={this.toggle}>Create video</ModalHeader>
                        <ModalBody>
                            <input
                                required
                                type="text"
                                placeholder="Title"
                                name="Title"
                                className="form-control"
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                name="Description"
                                className="form-control"
                            />
                            <input
                                required
                                type="file"
                                accept="video/*"
                                placeholder="Video"
                                name="Video"
                                className="forn-control form-control-file"
                            />
                        </ModalBody>
                        <ModalFooter>
                            <button type="submit" disabled={this.state.form} className="btn btn-primary">Submit</button>
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        )
    }
}

export default CreateVideo;