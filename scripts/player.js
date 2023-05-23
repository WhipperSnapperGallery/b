let basicMessage = "";

const filePath = '/assets/vid/links.txt';
const videoIds = [];
const videoPlayers = [];
let currentVid = 0;
let currentCarousel = "carousel0";
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
        player.attr("src", `https://www.youtube-nocookie.com/embed/${videoIds[i - 1]}?controls=0&disablekb=1&enablejsapi=1&fs=0&modestbranding=1&playsinline=1&iv_load_policy=3`);
        videoPlayers[`player${i}`] = new YT.Player(`player${i}`, {
            events: {
                'onReady': onPlayerReady
            }
        });
    }
}

function nextVideo() {
    const current = $(`#${currentCarousel}`);
    const next = current.attr('id') === "carousel0" ? $("#carousel1") : $("#carousel0");
    currentCarousel = currentCarousel === "carousel0" ? "carousel1" : "carousel0";
    const videoPlayer = current.children('div').children('iframe').attr('id');
    videoPlayers[videoPlayer].stopVideo();
    currentVid = (currentVid + 1) % videoIds.length;
    const nextPlayer = next.children('div').children('iframe')
    nextPlayer.attr("src", `https://www.youtube-nocookie.com/embed/${videoIds[currentVid]}?controls=0&disablekb=1&enablejsapi=1&fs=0&modestbranding=1&playsinline=1&iv_load_policy=3`);
}

function previousVideo() {
    const current = $(`#${currentCarousel}`);
    const next = current.attr('id') === "carousel0" ? $("#carousel1") : $("#carousel0");
    currentCarousel = next.attr('id');
    const videoPlayer = current.children('div').children('iframe').attr('id');
    videoPlayers[videoPlayer].stopVideo();
    currentVid = (currentVid - 1) < 0 ? videoIds.length - 1 : currentVid - 1;
    const nextPlayer = next.children('div').children('iframe')
    nextPlayer.attr("src", `https://www.youtube-nocookie.com/embed/${videoIds[currentVid]}?controls=0&disablekb=1&enablejsapi=1&fs=0&modestbranding=1&playsinline=1&iv_load_policy=3`);
}

function stopLastVideo() {
    last = currentCarousel === "carousel0" ? $("#carousel1") : $("#carousel0");
    const videoPlayer = last.children('div').children('iframe').attr('id');
    videoPlayers[videoPlayer].pauseVideo();
}

function stopCurrentVideo() {
    const current = $(`#${currentCarousel}`);
    const videoPlayer = current.children('div').children('iframe').attr('id');
    videoPlayers[videoPlayer].pauseVideo();
}

function onPlayerReady() {
    const current = $(".active");
    const videoPlayer = current.children('div').children('iframe').attr('id');
    videoPlayers[videoPlayer].playVideo();
}

function onYouTubeIframeAPIReady() {
    setupLinks();
}

$(document).ready(() => {
    const sessionID = uuidv4();

    window.addEventListener("load", () => {basicMessage = $("#chatbox").html()})

    $('#main-carousel').on('slide.bs.carousel', function (e) {
        if (e.direction == "left") {
            nextVideo();
        }
        else {
            previousVideo();
        }
    });



    $('#main-carousel').on('slid.bs.carousel', function () {
        stopLastVideo();
        // Reset the chatbox
        console.log($("#chatbox").html() === basicMessage);
        console.log($("#chatbox").html());
        console.log(basicMessage);
        if ($("#chatbox").html() !== basicMessage) {
            sendEmail(sessionID, $("#chatbox").html());
            let firstMessage = "Are you in love?";
            $("#chatbox").html(`<p class="botText"><span class=uText-label>Them:&nbsp;</span><span> ${firstMessage} </span></p>`);
            basicMessage = $("#chatbox").html();
        }
        
    });

    let videoStream;
    const videoElems = document.querySelectorAll('.webcam');

    const modal = document.getElementById("videoModal");
    modal.addEventListener("shown.bs.modal", function () {
        checkingWCPermissionAndModalEngaged = true;
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            //Stop the current video
            stopCurrentVideo();
            // Access the webcam
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    modal.classList.remove("d-none"); //Don't show the modal until
                    // Store the video stream
                    for (let videoElement of videoElems) {
                        videoStream = stream;
                        // Display the video stream on a video element
                        videoElement.srcObject = stream;
                        videoElement.play();
                        checkingWCPermissionAndModalEngaged = false;
                        errorOccurredWhileEngagingModal = false;
                    }
                })
                .catch(function (error) {
                    console.error('Error accessing webcam:', error);
                });
        } else {
            console.error('getUserMedia is not supported by this browser.');
        }
    });

    modal.addEventListener("hidden.bs.modal", function () {
        if (videoStream) {
            // Stop all tracks in the video stream
            videoStream.getTracks().forEach(function (track) {
                track.stop();
            });
            // Remove the video element
            videoStream = null; // Reset the video stream
        }
    });
});