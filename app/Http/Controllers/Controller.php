<?php

namespace App\Http\Controllers;

use App\Helpers\YoutubeApi;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Google_Client;
use Google_Service_YouTube;
use Google_Service_YouTube_Video;
use Google_Service_YouTube_VideoSnippet;
use Google_Service_YouTube_VideoStatus;



class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function getPlayLists()
    {
//        $videoSnippet = new \Google_Service_YouTube_VideoSnippet()
        $client = new Client();

        try {
            $response = $client->request(
                'GET',
                'https://www.googleapis.com/youtube/v3/channels',
                [
                    'headers' => ['Authorization' => 'Bearer ' . YoutubeApi::getToken()->access_token],
                    'query' => [
                        'part' => 'contentDetails',
                        'mine' => 'true'
                    ]
                ]
            );
            return json_decode($response->getBody()->getContents());
        } catch (ClientException $exception) {
            if (YoutubeApi::REPEATER >= YoutubeApi::$repeat) {
                YoutubeApi::$repeat++;
                YoutubeApi::refreshToken();
                return $this->getPlayLists();
            } else {
                return false;
            }
        }
    }

    public function getVideoList(string $idPlayList)
    {
        $client = new Client();
        try {
            $response = $client->request(
                'GET',
                'https://www.googleapis.com/youtube/v3/playlistItems',
                [
                    'headers' => ['Authorization' => 'Bearer ' . YoutubeApi::getToken()->access_token],
                    'query' => [
                        'part' => 'snippet,contentDetails',
                        'playlistId' => $idPlayList
                    ]
                ]
            );
            return json_decode($response->getBody()->getContents());
        } catch (ClientException $exception) {
            if (YoutubeApi::REPEATER >= YoutubeApi::$repeat) {
                YoutubeApi::$repeat++;
                YoutubeApi::refreshToken();
                return $this->getVideoList($idPlayList);
            } else {
                return false;
            }
        }
    }

    public function getVideosInChannel()
    {
        $playLists = $this->getPlayLists();
        if (!empty($playLists) && count($playLists->items) > 0) {
            $idPlaylist = $playLists->items[0]->contentDetails->relatedPlaylists->uploads;
            $videoList = $this->getVideoList($idPlaylist);
            if (!empty($videoList) && count($videoList->items) > 0) {
                return response(json_encode($videoList));
            }else if(!empty($videoList) && count($videoList->items) == 0){
                return response('Video not found');
            } else {
                return response('Failed data!', 400);
            }
        } else {
            return response('Failed data!', 400);
        }
    }

    public function updateVideo(Request $request)
    {
        if (!empty($request['data'])) {
            $client = new Client();

            try {
                $response = $client->request(
                    'PUT',
                    'https://www.googleapis.com/youtube/v3/videos?part=snippet',
                    [
                        'json' => $request['data'],
                        'headers' => ['Authorization' => 'Bearer ' . YoutubeApi::getToken()->access_token],
                    ]
                );
                return response($response->getBody()->getContents());
            } catch (ClientException $exception) {
                if (YoutubeApi::REPEATER >= YoutubeApi::$repeat) {
                    YoutubeApi::$repeat++;
                    YoutubeApi::refreshToken();
                    return $this->updateVideo($request);
                } else {
                    return response($exception->getResponse()->getBody()->getContents(), 400);
                }
            }
        } else {
            return response('Failed data!', 400);
        }
    }

    public function deleteVideo(Request $request)
    {
        if (!empty($request['id'])) {
            $client = new Client();

            try {
                $response = $client->request(
                    'DELETE',
                    'https://www.googleapis.com/youtube/v3/videos',
                    [
                        'headers' => ['Authorization' => 'Bearer ' . YoutubeApi::getToken()->access_token],
                        'query' => [
                            'id' => $request['id']
                        ]
                    ]
                );
                return response($response->getBody()->getContents());
            } catch (ClientException $exception) {
                if (YoutubeApi::REPEATER >= YoutubeApi::$repeat) {
                    YoutubeApi::$repeat++;
                    YoutubeApi::refreshToken();
                    return $this->deleteVideo($request);
                } else {
                    return response($exception->getResponse()->getBody()->getContents());
                }
            }
        } else {
            return response('Failed data!', 400);
        }
    }

    public function createVideo(Request $request)
    {
//        dump($request->all());
//        $file = $request->file('video')->openFile();
//        file_put_contents(public_path('dsa.mp4'), $file->fread($file->getSize()));

        if (!empty($request->file('video')) && !empty($request['name'])) {

            $file = $request->file('video')->openFile();

            $client = new Google_Client();
            $client->setAccessToken(YoutubeApi::getToken()->access_token);

// Define service object for making API requests.
            $service = new Google_Service_YouTube($client);

// Define the $video object, which will be uploaded as the request body.
            $video = new Google_Service_YouTube_Video();

// Add 'snippet' object to the $video object.
            $videoSnippet = new Google_Service_YouTube_VideoSnippet();
            $videoSnippet->setCategoryId('1');
            $videoSnippet->setDescription($request['description']);
            $videoSnippet->setTitle($request['name']);
            $video->setSnippet($videoSnippet);

// Add 'status' object to the $video object.
            $videoStatus = new Google_Service_YouTube_VideoStatus();
            $videoStatus->setPrivacyStatus('public');
            $video->setStatus($videoStatus);

//       with a pointer to the actual file you are uploading.
//       The maximum file size for this operation is 128GB.
            $response = $service->videos->insert(
                'snippet,status',
                $video,
                array(
                    'data' => $file->fread($file->getSize()),
                    'mimeType' => 'video/*',
                    'uploadType' => 'multipart'
                )
            );
            if($response->getStatus()->uploadStatus == 'uploaded'){
                return response(json_encode($response->getStatus()));
            }else{
                return response(json_encode($response->getStatus()), 400);
            }
        } else {
            return response('Failed data!', 400);
        }
    }

    public function redirect(Request $request)
    {
        return response($request);
    }
}
