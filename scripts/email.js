/**
 * These scripts work together with the SMTPJS library and Elasticemail
 * to automatically send a message to your e-mail address when someone
 * completes a contact form.
 * 
 * You will need to set up an Elasticemail account (this is free) in
 * order for this to work most effectively since SMTPJS seems to be
 * built with this service in mind - even allowing you to use a secure
 * token rather than broadcasting your e-mail credentials.
 */

const token = "7d1c205e-b8d3-4b6a-883b-c6303d212304"
const mainEmail = "lovexxlovechat@gmail.com"
let basicMessage = "";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

function buildMailString(sendName, messageBody) {
    return `Chat record for session ID ${sendName}:
    <br><br>${messageBody}<br><br> End of chat record.`;
}

//Sends email and returns promise object containing info on status of sending
const sendMail = function (sendName, messageBody) {
    return Email.send({
        SecureToken: token,
        To: mainEmail,
        From: mainEmail,
        Subject: `New chat for session ID ${sendName}`,
        Body: buildMailString(sendName, messageBody),
    })
}
const sendEmail = (sendName, messageBody) => {
    sendMail(sendName, messageBody).then(value => {
        if (value === 'OK') {
            showSubmitted();
            sendConfirmation(sendName, sendEmail);
            $('#sendName').val("");
            $('#sendEmail').val("");
            $('#sendPhone').val("");
            $('#messageBody').val("");
        }
        else {
            showFailed();
        }
    });
}