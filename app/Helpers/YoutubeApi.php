<?php
/**
 * Created by PhpStorm.
 * User: yol
 * Date: 027 27.07.19
 * Time: 20:26
 */

namespace App\Helpers;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\GuzzleException;

final class YoutubeApi
{
    public const REFRESH_TOKEN = '1/Ea_v7pty9p5LOv3pMVEeuz1G84QW01URS5eIy-mnte0Ej7k6vbwk9WkyY8eFLDWm';
    public const CLIENT_ID = '832977029158-ipvrt2gdnr3ikqlmiil0si34qn6i1t10.apps.googleusercontent.com';
    public const CLIENT_SECRET = 'n4VaTTpn_Y8bi3bCxZp5irg1';
    private const FILENAME_TOKEN = 'token.json';
    public const REPEATER = 3;
    public static $repeat = 0;


    public static function getToken()
    {
        return json_decode(
            file_get_contents(
                config_path(self::FILENAME_TOKEN)
            )
        );
    }

    public static function refreshToken()
    {
        $client = new Client();

        try {
            $response = $client->request(
                'POST',
                'https://www.googleapis.com/oauth2/v4/token',
                [
                    'form_params' => [
                        'refresh_token' => self::REFRESH_TOKEN,
                        'client_id' => self::CLIENT_ID,
                        'client_secret' => self::CLIENT_SECRET,
                        'grant_type' => 'refresh_token'
                    ]
                ]
            );

            file_put_contents(config_path(self::FILENAME_TOKEN), $response->getBody()->getContents());
        } catch (ClientException $exception) {
            if(self::REPEATER >= self::$repeat){
                self::$repeat++;
                return self::refreshToken();
            }else{
                return response('Failed data!', 400);
            }
        }
    }
}