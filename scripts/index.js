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

function goToNext(elems) {
  let oldSelected = $(".carousel-selected");
  let newSelected = $(".carousel-next");
  oldSelected.off("hover");
  console.log("Previous list:");
  console.log(elems);
  let movedElem = elems.shift();
  elems.push(movedElem);
  console.log("Post list:");
  console.log(elems);
  setCarouselements(elems);
  newSelected.hover(revealButtons, hideButtons);
}

function goToPrevious(elems) {
  let oldSelected = $(".carousel-selected");
  let newSelected = $(".carousel-prev");
  oldSelected.off("hover");
  console.log("Previous list:");
  console.log(elems);
  let movedElem = elems.pop();
  elems.unshift(movedElem);
  console.log("Post list:");
  console.log(elems);
  setCarouselements(elems);
  newSelected.hover(revealButtons, hideButtons);
}

const filePath = '/assets/vid/links.txt';
const videoPlayers = []

const createNewPlayer = (id, videoId) => {
  videoPlayers[id] = new YT.Player(`player${id}`, {
    videoId: videoId,
    playerVars: {
      'playsinline': 1,
      'controls': 0,
      'enablejsapi': 1,
      'fs': 0,
      'iv_load_policy': 3,
      'modestbranding': 1
    }
  });
}

const buildCarouselementAndAddIt = id => {
  const newElem = `<div class="carouselement" width="100%" height="100%">
        <div class="vid-player" id="player${id}" width="800px" height="800px"></div>
    </div>`;
  const carouselContainer = $("#main-carousel");
  carouselContainer.html(carouselContainer.html() + newElem);
}

function getLinks(callback) {
  console.log("Whaddup");
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
  console.log("Hello!");
  let links = text.split("\n");
  // Loop through each line and create new players
  for (const [i, line] of links.entries()) {
    if (line.trim().indexOf("youtube") > -1) {
      const parts = line.split('?v=');
      const videoId = parts[1].split('&')[0];
      buildCarouselementAndAddIt(i);
      createNewPlayer(i, videoId);
      console.log(line);
    }
  }
  let carouselements = $(".carouselement").toArray();
  setCarouselements(carouselements);
  $(".carousel-selected").hover(revealButtons, hideButtons);
  $(".hover-ctrl").hover(revealButtons);
  $("#btn-next").on("click", () => {goToNext(carouselements);});
  $("#btn-prev").on("click", () => {goToPrevious(carouselements)});
}

//Function to create the iFrames
function onYouTubeIframeAPIReady() {
  getLinks(setupPlayers);
}