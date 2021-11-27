document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    document.querySelector('#compose').addEventListener('click', compose_email);

    // By default, load the inbox
    load_mailbox('inbox');

    // Send the email
    document.querySelector('#submit-send').addEventListener('click', function(event) {

        // Prevent form submission
        event.preventDefault();

        // Send the email
        send_email();
    });
});

function compose_email() {

    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#read-view').style.display = 'none';
    document.querySelector('#sent-view').style.display = 'none';
    document.querySelector('#archived-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#read-view').style.display = 'none';
    document.querySelector('#read-view').innerHTML = '';
    document.querySelector('#sent-view').style.display = 'none';
    document.querySelector('#sent-view').innerHTML = '';
    document.querySelector('#archived-view').style.display = 'none';
    document.querySelector('#archived-view').innerHTML = '';

    // Show the mailbox name
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

    // Show the mailbox content
    fetch(`/emails/${mailbox}`)
        .then(response => response.json())
        .then(emails => {
            emails.forEach(email => {
                console.log(email);
                if (email.read === true) {
                    document.querySelector('#emails-view').innerHTML += `   
            <div class="row border border-primary p-1 m-2" id="email">  
                    <div class="col-5 text-decoration-none">
                        <p><strong><a href="#" onclick="read_email('${email.id}')">
                       From: ${email.sender}</a></strong></p>
                    </div>
                    <div class="col-auto">
                        <p><a href="#" onclick="read_email('${email.id}')">
                            Subject: ${email.subject}
                        </a></p>
                    </div>               
            </div>    
        `;
                } else {
                    document.querySelector('#emails-view').innerHTML += `     
            <div class="row bg-secondary bg-opacity-50 p-2 m-2" id="email" style="text-decoration: none;">           
                    <div class="col-4">
                        <p><a href="#" onclick="read_email('${email.id}')">
                       From: ${email.sender}</a></p>
                    </div>
                    <div class="col-auto">
                        <p><a href="#" onclick="read_email('${email.id}')">
                            Subject: ${email.subject}
                        </a></p>
                    </div>
            </div>
        `;
                }
            });
        });
}

function send_email() {

    // Get the values from the form
    const data = {
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value,
        read: false,
    };

    // Send the email
    fetch('/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
}

function read_email(id) {

    // Show the email and hide other views
    document.querySelector('#read-view').style.display = 'block';
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#read-view').innerHTML = '';
    document.querySelector('#sent-view').style.display = 'none';
    document.querySelector('#sent-view').innerHTML = '';
    document.querySelector('#archived-view').style.display = 'none';
    document.querySelector('#archived-view').innerHTML = '';

    // Show the email content
    fetch(`/emails/${id}`)
        .then(response => response.json())
        .then(email => {
            console.log(email);
            document.querySelector('#read-view').innerHTML += `
            <div class="email-item container">
                <div class="row m-2">
                <div class="email-header col-12 mt-2 border-end border-start  border-top">
                  <p><small> From:  </small><strong>${email.sender}</strong></p>
                </div>
                </div>
                <div class="row m-2">
                <div class="email-header col-12 border-end border-start">
                  <p><small> Recipients:  </small><strong>${email.recipients}</strong></p>
                </div>
                </div>
                <div class="row m-2">
                    <div class="read-sender  col-12 border-end border-start" id="read-sender">
                      <p><small> Sent: ${email.timestamp}</small></p>
                    </div>
                    </div>
                    <div class="row m-2">
                    <div class="read-subject col-12 mb-2 border-end border-start border-bottom" id="read-subject">
                     <p><small> Subject: </small></p><p><strong>${email.subject}</strong></p>
                    </div>
                </div>
                <div class="row m-2">
                <div class="buttons col-12 p-2 border-end border-start" id="buttons">
                <btn class="btn btn-primary" onclick="archive_email('${email.id}')">Archive</btn>
                <btn class="btn btn-primary" onclick="delete_email('${email.id}')">Delete</btn>
                <btn class="btn btn-primary" onclick="reply_email('${email.id}')">Reply</btn>
                <btn class="btn btn-primary" onclick="forward_email('${email.id}')">Forward</btn>
                <btn class="btn btn-primary" onclick="mark_read('${email.id}')">Mark Read</btn>
                <btn class="btn btn-primary" onclick="mark_unread('${email.id}')">Mark Unread</btn>
                </div>
                </div>
                <div class="row m-2">
                <div class="read-body col-12 mt-2 p-2 border" id="read-body">
                   <p class="lead">${email.body}</p>
                </div>
                </div>        
                </div>        
        `;
        }).catch(error => {
            console.error('Error:', error);
        });
}