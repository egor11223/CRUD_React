import React, {Component} from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

class DeleteVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            form: false,
        };

        this.toggle = this.toggle.bind(this);
        this.deleteAction = this.deleteAction.bind(this);
    }

    async deleteAction() {
        this.setState({
            form: !this.state.form
        });
        const response = await axios.delete('/delete', {data: {id: this.props.video.contentDetails.videoId}});
        console.log(response);
        await this.toggle();
        await setTimeout(() => {this.props.getVideos()}, 10000);
        await this.props.showAlert('Delete');
        await this.setState({
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
                <a href="#" onClick={this.toggle}><img src="/img/octicons/trashcan.svg" alt=""/></a>

                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Delete video</ModalHeader>
                    <ModalBody>
                        <h2>Are you sure?</h2>
                    </ModalBody>
                    <ModalFooter>
                        <button type="submit" onClick={this.deleteAction} disabled={this.state.form}
                                className="btn btn-primary">Submit
                        </button>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default DeleteVideo;