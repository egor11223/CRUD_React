import React, {Component} from 'react';
import VideoItem from "./VideoItem";

class DisplayVideo extends Component {

    render() {

        const videoList = this.props.videos.map((video) => {
            return <VideoItem
                video={video}
                key={video.id}
                getVideos={this.props.getVideos}
                showAlert={this.props.showAlert}
            />
        });
        return (
            <div>

                <table className="table table-bordered table-condensed table-hover">
                    <thead>
                    <tr>
                        <td>Video</td>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>

                    </thead>
                    <tbody id="form-list-client-body">
                    {videoList}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default DisplayVideo