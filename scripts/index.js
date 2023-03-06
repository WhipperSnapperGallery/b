window.addEventListener("DOMContentLoaded", () => {
  
  const carouselItems = $(".carouselement");

  const goToNext = () => {
    //Set up the variables
    let selected = $(".carousel-selected");
    let upcoming = $(".carousel-next");
    let previous = $(".carousel-prev");
    let newNext = $(".carousel-next-next");
    let newPrevious = $(".carousel-prev-prev");
    let rightReveal = $(".carousel-hidden-right");
    let leftReveal = $(".carousel-hidden-left");
    
    //Class changes for original selected item
    selected.removeClass("carousel-selected");
    selected.addClass("carousel-prev");

    //Right side class changes
    upcoming.removeClass("carousel-next");
    upcoming.addClass("carousel-selected");
    newNext.removeClass("carousel-next-next");
    newNext.addClass("carousel-next");
    rightReveal.removeClass("carousel-hidden-right");
    rightReveal.addClass("carousel-next-next");
    
    //Left side class changes
    previous.removeClass("carousel-prev");
    previous.addClass("carousel-prev-prev");
    newPrevious.removeClass("carousel-prev-prev");
    newPrevious.addClass("carousel-hidden-left");
    leftReveal.removeClass("carousel-hidden-left");
    leftReveal.addClass("carousel-hidden-right");
  }

  const goToPrevious = () => {
    //Set up the variables
    let selected = $(".carousel-selected");
    let upcoming = $(".carousel-next");
    let previous = $(".carousel-prev");
    let newNext = $(".carousel-next-next");
    let newPrevious = $(".carousel-prev-prev");
    let rightReveal = $(".carousel-hidden-right");
    let leftReveal = $(".carousel-hidden-left");
    
    //Class changes for original selected item
    selected.removeClass("carousel-selected");
    selected.addClass("carousel-next");

    //Right side class changes
    upcoming.removeClass("carousel-next");
    upcoming.addClass("carousel-next-next");
    newNext.removeClass("carousel-next-next");
    newNext.addClass("carousel-hidden-right");
    rightReveal.removeClass("carousel-hidden-right");
    rightReveal.addClass("carousel-hidden-left");
    
    //Left side class changes
    previous.removeClass("carousel-prev");
    previous.addClass("carousel-selected");
    newPrevious.removeClass("carousel-prev-prev");
    newPrevious.addClass("carousel-prev");
    leftReveal.removeClass("carousel-hidden-left");
    leftReveal.addClass("carousel-prev-prev");
  }

  $("#next").on("click", () => {
    goToNext();
  });

  $("#prev").on("click", () => {
    goToPrevious();
  });
});
