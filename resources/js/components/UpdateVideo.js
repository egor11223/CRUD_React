import React, {Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledAlert } from 'reactstrap';

class UpdateVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            form: false
        };

        this.toggle = this.toggle.bind(this);
    }

    updateVideo = async (e) =>
    {
        e.preventDefault();
        this.setState({
           form: !this.state.form
        });
        let data = {
            "id": this.props.video.contentDetails.videoId,
            "snippet": {
                "description": e.target.elements.Description.value,
                "categoryId": "1",
                "title": e.target.elements.Title.value
            }
        };

        const response = await axios.post('/update', {data: data});
        console.log(response);
        await this.props.getVideos();
        await this.toggle();
        await this.props.showAlert('Update');
        this.setState({
            form: !this.state.form
        });
    };

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        return (
            <div>
                <a href="#" onClick={this.toggle}><img src="/img/octicons/pencil.svg" alt="Update video"/></a>

                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <form onSubmit={this.updateVideo}>
                        <ModalHeader toggle={this.toggle}>Update video</ModalHeader>
                        <ModalBody>
                            <input
                                name="Title"
                                type="text"
                                className="form-control"
                                id="Title"
                                placeholder="Title"
                                defaultValue={this.props.video.snippet.title}
                            />
                            <input
                                name="Description"
                                type="text"
                                className="form-control"
                                id="Description"
                                placeholder="Description"
                                defaultValue={this.props.video.snippet.description}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <button type="submit" disabled={this.state.form} className="btn btn-primary">Submit</button>
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        );
    }
}

export default UpdateVideo;