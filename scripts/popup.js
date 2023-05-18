document.addEventListener("DOMContentLoaded", function () {
    let videoStream;
    const videoElems = document.querySelectorAll('.webcam');

    const modal = document.getElementById("videoModal");
    modal.addEventListener("shown.bs.modal", function () {
        let targetElem = $(".carousel-selected").children("iframe");
        let targetId = targetElem.attr("id");
        let targetPlayer = videoPlayers[targetId];
        console.log(JSON.stringify(targetPlayer));
        targetPlayer.pauseVideo();
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Access the webcam
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    // Store the video stream
                    for (let videoElement of videoElems) {
                        videoStream = stream;

                        // Display the video stream on a video element
                        videoElement.srcObject = stream;
                        videoElement.play();
                    }
                })
                .catch(function (error) {
                    console.error('Error accessing the webcam:', error);
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