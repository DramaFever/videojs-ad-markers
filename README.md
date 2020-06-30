<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Videojs Ad Markers](#videojs-ad-markers)
  - [What's the goal](#whats-the-goal)
  - [Features](#features)
  - [Example](#example)
    - [Developer example](#developer-example)
  - [History Log](#history-log)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Videojs Ad Markers
=======================
2020-06-26


Plugin for videojs which provides basic functionality for ad markers.


What's the goal
--------------------

The goal is to generate ad markers that come in the middle of a video (aka mid-rolls).
A lot like youtube.com does.


Features
--------------------

- easy timeline point customization via css


Example
-----------

### Developer example
 
The example below is a development (not production) example which displays both video containers (see the concept of video containers
in the "How does it work?" section).
In order to successfully implement this example, you need to have some mp4 files on your machine.


```html
<!DOCTYPE html>
<html>
<head>
    
    <script src="http://vjs.zencdn.net/7.x.x/video.js"></script>
    <link href="http://vjs.zencdn.net/7.x.x/video-js.css" rel="stylesheet">

    
    <!-- ad markers plugin, depends from jquery -->
    <script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>    
    <script src="/dist/videojs-ad-markers.js"></script>
    <link href="/dist/videojs-ad-markers.css" rel="stylesheet">    
</head>


<body>


<!-- This is the main video -->
<video id="my-video" class="video-js" controls preload="auto" width="640" height="264"
       poster="https://s-media-cache-ak0.pinimg.com/736x/81/23/e1/8123e1e5525c730644f85df3bb85b9ae.jpg"
    >
    <source src="http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4"
            type='video/mp4'>
    <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a web browser that
        <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
    </p>
</video>



<!-- This is the ads video container -->
<video id="ads-container" class="video-js" controls preload="auto" width="640" height="264"
       poster="https://s-media-cache-ak0.pinimg.com/736x/81/23/e1/8123e1e5525c730644f85df3bb85b9ae.jpg"
    >
    <source src="/mp4/beer.mp4" type="video/mp4">
    <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a web browser that
        <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
    </p>
</video>



<script>

    (function () {


        //------------------------------------------------------------------------------/
        // CONFIG
        //------------------------------------------------------------------------------/
        var startTime = 5;
        var myPlayer = videojs('my-video');
        var adsPlayer = videojs('ads-container');
        adsPlayer.on('ended', function () {
            myPlayer.play();
            myPlayer.adMarkers.adPlaying = false; // whenever an ad ends, you must set this flag to false
        });




        myPlayer.adMarkers();

        myPlayer.adMarkers().setMarkers({
            markers: [
                // In this example, we use server hosted mp4 only
                {time: 20}, 
                {time: 50},
                {time: 80},
                {time: 180}
            ]
        });

	    /**
	     * Trick if you want to play/start the main video from a position different than 0. 
         */
        myPlayer.on('loadedmetadata', function () {
            myPlayer.currentTime(startTime);
            myPlayer.play();
        });

    })();
</script>

</body>
</html>

```

 
Note: in the above example I use a default video for the ad video container, so that there is no js error.   
 
 
 History Log
------------------
- 2.0.0 -- 2020-06-26

    - rewrite in ES6 and remove unnecessary functionality
    
- 1.0.0 -- 2015-12-07

    - initial commit

- 0.0.1 -- 2015-12-06

    - first sketch
