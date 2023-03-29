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
window.addEventListener('DOMContentLoaded', event => {
    function buildMailString(sendName, sendEmail, sendPhone, messageBody) {
        return `You received the following message from ${sendName}:
        <br><br>${messageBody}<br><br>
        To respond, contact by mail at ${sendEmail} or by phone at${sendPhone}
        <br><br><small>This message was automatically generated from an unmonitored e-mail address</small>`;
    }

    function buildConfirmString(sendName) {
        return `Hi ${sendName},<br><p>Thanks for your message! I may not see 
        it right away, but I will certainly get back to you as soon as I can</p>
        <br><br>Regards,<br>Omar Musleh`
    }


    //Sends email and returns promise object containing info on status of sending
    const sendMail = function (sendName, sendEmail, sendPhone, messageBody) {
        return Email.send({
            SecureToken: "ad3540cc-ab63-4910-8569-927a80e104e9",
            To: 'inquiries@omarmusleh.com',
            From: "no-reply@omarmusleh.com",
            Subject: `${sendName} sent you an inquiry!`,
            Body: buildMailString(sendName, sendEmail, sendPhone, messageBody),
        })
    }

    const sendConfirmation = function (sendName, sendEmail) {
        Email.send({
            SecureToken: "ad3540cc-ab63-4910-8569-927a80e104e9",
            To: `${sendEmail}`,
            From: "no-reply@omarmusleh.com",
            Subject: `Message Confirmation`,
            Body: buildConfirmString(sendName),
        })
    }

    //Function for displaying a success message for three seconds after submitting
    //Configure as appropriate for your element names and CSS framework.
    //This syntax requires jQuery as a dependency.
    const showSubmitted = function () {
        let msg = $('#submitSuccessMessage');
        msg.addClass('text-success');
        msg.removeClass('d-none');
        setTimeout(() => {
            msg.addClass('d-none');
            msg.removeClass('text-success');
        }, 3000);
    }

    //Similar to the above, for when the message fails to send for whatever reason.
    const showFailed = function () {
        let msg = $('#submitErrorMessage')
        msg.removeClass('d-none');
        setTimeout(() => {
            msg.addClass('d-none');
        }, 3000);
    }
});

//Contact Form Submit
$('#submitButton').on('click', () => {
    let sendName = $('#sendName').val();
    let sendEmail = $('#sendEmail').val();
    let sendPhone = $('#sendPhone').val();
    let messageBody = $('#messageBody').val();
    sendMail(sendName, sendEmail, sendPhone, messageBody).then(value => {
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
  });