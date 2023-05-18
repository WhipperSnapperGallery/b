document.addEventListener("DOMContentLoaded", () => {
    // Collapsible
    // Collapsible
    let coll = $(".collapsible");

    // If there is only one collapsible element (the chatbox) there is no need
    // to iterate over a list
    coll.click(() => {
        $(this).toggleClass("active");

        let content = coll.next();
        if (content.css("max-height") !== "0px") {
            content.css("max-height", "0px");
        } else {
            content.css("max-height", content[0].scrollHeight + "px");
        }
    });

    // Gets the first message
    function firstBotMessage() {
        let firstMessage = "Are you in love?";
        $("#botStarterMessage").html(
            `<p class="botText"><span class=uText-label>Them:&nbsp;</span><span> ${firstMessage} </span></p>`
        );
    }

    firstBotMessage();

    // Retrieves the response
    const postText = (postMessage) => {
        console.log("postText");
        let userText = $("#textInput").val();
        $("#textInput").val(postMessage); //set the user input to whatever post message before the API call so it appears instantly, mainly for button-based messages
        if (userText) {
            let userHtml = '<p class="userText"><span class="uText-label">You:&nbsp;</span><span class=uText-content>' + userText + "</span></p>";
            $("#chatbox").append(userHtml);
            $("#chat-bar-bottom")[0].scrollIntoView(true);
        }
    };

    // Press enter to send a message
    $("#textInput").keypress(function (e) {
        if (e.which == 13) {
            postText("");
        }
    });

// Handles sending text via button clicks
  function buttonSendText(sampleText) {
    let tempText = $("#textInput").val(); //gets the user's initial text input
    $("#textInput").val(sampleText); //sets the user's text input to the sample text
    postText(tempText); //gets the response
  }

  const heartButton = () => {
    buttonSendText("&#129505");
  };

    // Press the send button to send a message
    $("#send-icon").click((e) => {
        postText("");
    });

    $("#heart-icon").click(heartButton);
});