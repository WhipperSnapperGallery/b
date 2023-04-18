const filePath = '/assets/vid/links.txt';
const videoIds = [];
const videoPlayers = [];
let currentVid = 0;

function getLinks(callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
        const text = xhr.responseText;
        callback(text);
        createPlayers();
    };
    xhr.open('GET', filePath, true);
    xhr.responseType = 'text';
    xhr.send();
}

function setupLinks() {
    getLinks((text) => {
        let links = text.split("\n");
        for (const [i, line] of links.entries()) {
            if (line.trim().indexOf("youtube") > -1) {
                const parts = line.split('?v=');
                const videoId = parts[1].split('&')[0];
                videoIds.push(videoId);
            }
        }
    });
}


function createPlayers() {
    console.log(videoIds)
    for (let i = 1; i <= 2; i++) {
        const player = $(`#player${i}`);
        player.attr("src", `https://www.youtube-nocookie.com/embed/${videoIds[i-1]}?controls=0&disablekb=1&enablejsapi=1&fs=0&modestbranding=1&playsinline=1&iv_load_policy=3`);
        videoPlayers[`player${i}`] = new YT.Player(`player${i}`, {
            events: {
                'onReady': onPlayerReady,
            }
        });
    }
}

function nextVideo() {
    const current = $(".active");
    const next = $(".inactive");
    const videoPlayer = current.children('div').children('iframe').attr('id');
    console.log(videoPlayer)
    videoPlayers[videoPlayer].stopVideo();
    currentVid = (currentVid + 1) % videoIds.length;
    const nextPlayer = next.children('div').children('iframe')
    nextPlayer.attr("src", `https://www.youtube-nocookie.com/embed/${videoIds[currentVid]}?controls=0&disablekb=1&enablejsapi=1&fs=0&modestbranding=1&playsinline=1&iv_load_policy=3`);
    current.addClass("inactive");
    next.removeClass("inactive");
    console.log(currentVid)
    console.log(nextPlayer.attr('id'))
    videoPlayers[nextPlayer.attr('id')].playVideo();
    console.log("Next")
}

function previousVideo() {
    const current = $(".active");
    const next = $(".inactive");
    const videoPlayer = current.children('div').children('iframe').attr('id');
    console.log(videoPlayer)
    videoPlayers[videoPlayer].stopVideo();
    currentVid = (currentVid - 1) < 0 ? videoIds.length - 1 : currentVid - 1;
    console.log(currentVid)
    const nextPlayer = next.children('div').children('iframe')
    nextPlayer.attr("src", `https://www.youtube-nocookie.com/embed/${videoIds[currentVid]}?controls=0&disablekb=1&enablejsapi=1&fs=0&modestbranding=1&playsinline=1&iv_load_policy=3`);
    current.addClass("inactive");
    next.removeClass("inactive");
    
    console.log(nextPlayer.attr('id'))
    videoPlayers[nextPlayer.attr('id')].playVideo();
    console.log("Previous")
}

function onPlayerReady() {
    const current = $(".active");
    const videoPlayer = current.children('div').children('iframe').attr('id');
    videoPlayers[videoPlayer].playVideo();
}

function onYouTubeIframeAPIReady() {
    console.log("Hello!")
    setupLinks();
}

$(document).ready(() => {
    $('#main-carousel').on('slide.bs.carousel', function (e) {
        console.log("Hello again!")
        if (e.direction == "left") {
            nextVideo();
        }
        else {
            previousVideo();
        }
    });
});