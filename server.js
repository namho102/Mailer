var fs = require("fs");
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var nodemailer = require("nodemailer");

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/inbox');

var Mail = require('./model/mail');

var app = express();

app.use(express.static(__dirname + '/public'));

app.use(morgan('combined'))
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.get('/inbox', function(req, res) {
    res.sendFile(__dirname + '/public/mailbox.html');
});


var config = JSON.parse(fs.readFileSync((process.cwd()) + "/config.json", "utf-8"));

/*Mail Sender*/

var smtpTransport = nodemailer.createTransport("SMTP", {
    service: config.service,
    auth: {
        user: config.username,
        pass: config.password
    }
});

app.post('/send', function(req, res, next) {
    mailOptions = req.body;
    // console.log(mailOptions);

    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });

    res.send("success");
    // res.set('Content-Type', 'application/json'); // tell Angular that this is JSON

})

/*Mail Receiver*/

var MailListener = require("./");

var mailListener = new MailListener({
    username: config.username,
    password: config.password,
    host: config.imap.host,
    port: config.imap.port,
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false
    },
    mailbox: "INBOX",
    markSeen: true,
    fetchUnreadOnStart: true,
    attachments: true,
    attachmentOptions: {
        directory: "attachments/"
    }
});

mailListener.start();

mailListener.on("server:connected", function() {
    console.log("imapConnected");
});

mailListener.on("server:disconnected", function() {
    console.log("imapDisconnected");
});

mailListener.on("error", function(err) {
    console.log(err);
});

mailListener.on("mail", function(mail) {
    // console.log(mail.subject);
    // console.log(mail.from);
    // console.log(mail.date);
    // console.log(mail.text);
    var newMail = Mail({
        from: mail.from,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        date: mail.date
    });

    newMail.save(function(err) {
        if (err) throw err;
        console.log('New mail saved!');
    });

});

mailListener.on("attachment", function(attachment) {
    console.log(attachment);
});

app.get('/mails', function(req, res, next) {
    // imapStart();
    var msg = {};

    Mail.find({}, function(err, mails) {
        if (err) throw err;

        // object of all the mails
        res.send(mails);
    });
})


app.get('/mails/:id', function(req, res, next) {
    var id = req.params.id;
    Mail.findOne({_id: id}, function(err, mail) {
        if (err) throw err;
        res.send(mail);
    });
})




app.listen(8888, function() {
    console.log("Express Started on Port 8888");
});