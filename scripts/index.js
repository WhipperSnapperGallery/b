const filePath = '/assets/vid/links.txt';
const videoPlayers = [];
let currentPlayers = 0;
let numPlayers = 0;

//carousel control stuff
function setCarouselements(elems) {
  let middle = Math.floor(elems.length / 2);
  for (const [index, elem] of elems.entries()) {
      elem.className = "carouselement";
      switch (index) {
          case middle:
              elem.classList.add("carousel-selected");
              break;
          case middle - 1:   
              elem.classList.add("carousel-prev");
              break;
          case middle - 2:
              elem.classList.add("carousel-prev-prev");
              break;
          case middle + 1:
              elem.classList.add("carousel-next");
              break;
          case middle + 2:
              elem.classList.add("carousel-next-next");
              break;
          default:
              if (index < middle - 2) {
                  elem.classList.add("carousel-hidden-left");
              }
              if (index > middle + 2) {
                  elem.classList.add("carousel-hidden-right");
              }
      }
  }
}

function revealButtons() {
  const buttons = $(".ctrl-buttons");
  buttons.removeClass("hover-ctrl-hidden")
  buttons.addClass("hover-ctrl-reveal")
}

function hideButtons() {
  const buttons = $(".ctrl-buttons");
  buttons.removeClass("hover-ctrl-reveal");
  buttons.addClass("hover-ctrl-hidden");
}

const stopCurrentVideo = elem => {
  let target = elem.find(".vid-player");
  let id = parseInt(target.attr("id").slice(-1));
  console.log(id);
  console.log(videoPlayers);
  console.log(JSON.stringify(videoPlayers[id]));
  videoPlayers[id].pauseVideo();
}

const startCurrentVideo = elem => {
  let target = elem.find(".vid-player");
  let id = parseInt(target.attr("id").slice(-1));
  console.log("Playing current video...");
  console.log(JSON.stringify(videoPlayers[id]));
  videoPlayers[0].playVideo();
}

function stopButtonFunc() {
  let tgt = $(".carousel-selected");
  let btn = $(".btn-stop");
  stopCurrentVideo(tgt);
  btn.off("click");
  btn.click(startButtonFunc);
  btn.html("Start");
}

function startButtonFunc () {
  let tgt = $(".carousel-selected");
  startCurrentVideo(tgt);
  btn.off("click");
  btn.click(stopButtonFunc);
  btn.html("Stop");
}

function goToNext(elems) {
  let oldSelected = $(".carousel-selected");
  let newSelected = $(".carousel-next");
  oldSelected.off("hover");
  let movedElem = elems.shift();
  elems.push(movedElem);
  setCarouselements(elems);
  newSelected.hover(revealButtons, hideButtons);
}

function goToPrevious(elems) {
  let oldSelected = $(".carousel-selected");
  let newSelected = $(".carousel-prev");
  oldSelected.off("hover");
  let movedElem = elems.pop();
  elems.unshift(movedElem);
  setCarouselements(elems);
  newSelected.hover(revealButtons, hideButtons);
}


const createNewPlayer = (id) => {
  videoPlayers[id] = new YT.Player(`player${id}`, {
//     videoId: videoId,
//     playerVars: {
//       'playsinline': 1,
//       'controls': 0,
//       'enablejsapi': 1,
//       'fs': 0,
//       'iv_load_policy': 3,
//       'modestbranding': 1
//     },
    events: {
      'onReady': onPlayerReady,
    }
  });
//   $(`#player${id}`).attr("width", "100%");
//   $(`#player${id}`).attr("height", "56.5%");
}

function onPlayerReady() {
  if (currentPlayers === numPlayers)
    startCurrentVideo($(".carousel-selected"));
  else currentPlayers++;
  console.log("Player ready!")
  // console.table(event.target);
  // event.target.playVideo();
}

function buildCarouselementAndAddIt(id, videoId) {
  const newElem = `<div class="carouselement">
        <iframe class="vid-player" id="player${id}" type="text/html" width="100%" height="100%"
          src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&disablekb=1&enablejsapi=1&fs=0&modestbranding=1&playsinline=1&iv_load_policy=3"
          frameborder="0">
    </div>`;
  const carouselContainer = $("#main-carousel");
  carouselContainer.html(carouselContainer.html() + newElem);
}

function getLinks(callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const text = xhr.responseText;
    callback(text);
  };
  xhr.open('GET', filePath, true);
  xhr.responseType = 'text';
  xhr.send();
}

function setupPlayers(text) {
  let links = text.split("\n");
  numPlayers = links.length;
  // Loop through each line and create new players
  for (const [i, line] of links.entries()) {
    if (line.trim().indexOf("youtube") > -1) {
      const parts = line.split('?v=');
      const videoId = parts[1].split('&')[0];
      buildCarouselementAndAddIt(i, videoId);
      createNewPlayer(i);
    }
  }
  let carouselements = $(".carouselement").toArray();
  setCarouselements(carouselements);
  $(".carousel-selected").hover(revealButtons, hideButtons);
  $(".hover-ctrl").hover(revealButtons);
  $("#btn-next").on("click", () => {goToNext(carouselements);});
  $("#btn-prev").on("click", () => {goToPrevious(carouselements)});
  $("#btn-stop").on("click", stopButtonFunc);
  // startCurrentVideo($(".carousel-selected"));
}


//Function to create the iFrames
function onYouTubeIframeAPIReady() {
  getLinks(setupPlayers);
}