import React, {Component} from 'react';
import UpdateVideo from './UpdateVideo';
import DeleteVideo from './DeleteVideo';

class VideoItem extends Component {

    render() {
        const videoLink = `https://www.youtube.com/embed/${this.props.video.snippet.resourceId.videoId}`;
        return (
            <tr>
                <td>
                    <iframe src={videoLink} allowFullScreen title='Video player'/>
                </td>
                <td>{this.props.video.snippet.title}</td>
                <td>{this.props.video.snippet.description}</td>
                <td>
                    <div className="flexbox">
                        <UpdateVideo
                            video={this.props.video}
                            getVideos={this.props.getVideos}
                            showAlert={this.props.showAlert}
                        />
                        <DeleteVideo
                            video={this.props.video}
                            getVideos={this.props.getVideos}
                            showAlert={this.props.showAlert}
                        />
                    </div>
                </td>
            </tr>
        )
    }
}

export default VideoItem
