const functions = require('firebase-functions');
const request = require('request-promise');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');


const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer /PrW7qp4CXRwVhcDDqDuLSwK7pRP9wBUofM6ivoBk3y1TEct1iYYHzVr3lHIwtmyjsuHQSTCJO5+G9iSfhtmUk+IbHsLxhWU300C5boo5yDEpvqxBKOFDqbZEQfQym8/PQGcv4ffWmJeh2JyyKhrSVGUYhWQfeY8sLGRXgo3xvw=`
  // 'Authorization': `Bearer <Channel access token>
};

const app = express();

// Set use json api
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// End Set use json api

// Set CORS allowed all
app.all("/*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});
//End Set CORS allowed all

// Api send password to email
// url: https://us-central1-password-request-system.cloudfunctions.net/api/mail
app.post('/mail', async (req, res) => {
  console.log("/mail <<<<<", req.body)

  try {
    const success = await dispatchEmail(req.body);
    console.log(success);
    res.status(200).json(req.body)
  } catch (error) {
    res.status(400).json(error.messages)
  }


});
//End  Api send password to email


// Api send password to email
// url: https://us-central1-password-request-system.cloudfunctions.net/api/mail
app.post('/cancelEmail', async (req, res) => {
  console.log("/mail <<<<<", req.body)
  try {
    const success = await cancelEmail(req.body);
    console.log(success);
    res.status(200).json(req.body)
  } catch (error) {
    res.status(400).json(error.messages)
  }

});
//End  Api send password to email


// Api send notify to line prof
// url: https://us-central1-password-request-system.cloudfunctions.net/api
app.post('/', async (req, res, next) => {
  console.log("/ <<<<<", req.body)
  try {
    await replyLine(req.body)
    res.status(201).json(req.body)
  } catch (error) {
    res.status(400).json(error.messages)
  }

});
//End Api send notify to line prof


// function send notify to line
const replyLine = (bodyResponse) => {
  console.log()
  return request({
    method: `POST`,
    uri: `${LINE_MESSAGING_API}/push`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      to: bodyResponse.sendTo,
      messages: [
        {
          type: `text`,
          text: 'มีการยื่นคำร้องจาก ' + bodyResponse.name + ' สามารถตรวจสอบคำร้องได้ที่ line://app/1653801979-nL7M7LbQ',
        }
      ]
    })
  });
};
//End function send notify to line

// function send password to email
async function dispatchEmail(email) {
  const transporter = await nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'new.4049@gmail.com', // your email
      pass: 'Niinewza1234' // your email password
    }
  });
  const mailOptions = await {
    from: 'new.4049@gmail.com',                // sender
    to: email.email,                // list of receivers
    subject: 'ระบบยื่นคำร้องเข้าพบอาจารย์',              // Mail subject
    html: '<b>สวัสดีนี่เป็นระบบตอบรับอัตโนมัติจากระบบยื่นคำร้องเข้าพบอาจารย์รหัสชองคุณคือ ' + email.code + '</b>'   // HTML body
  };
  return transporter.sendMail(mailOptions);
}
// End function send password to email


// function cancel to email
async function cancelEmail(email) {
  const transporter = await nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'new.4049@gmail.com', // your email
      pass: 'Niinewza1234' // your email password
    }
  });
  const mailOptions = await {
    from: 'new.4049@gmail.com',                // sender
    to: email.email,                // list of receivers
    subject: 'ระบบยื่นคำร้องเข้าพบอาจารย์',              // Mail subject
    html: '<b>สวัสดีนี่เป็นระบบตอบรับอัตโนมัติจากระบบยื่นคำร้องเข้าพบอาจารย์ เนื่องจากคำร้องของคุณถูกยกเลิก กรุณาส่งคำร้องใหม่ภายหลัง</b>'   // HTML body
  };
  return transporter.sendMail(mailOptions);
}
// End function cancel to email

// export to https://us-central1-password-request-system.cloudfunctions.net/api
exports.api = functions.https.onRequest(app);




// plase allowed link with your email (new.4049@gmail.com )
// https://myaccount.google.com/lesssecureapps
// https://accounts.google.com/DisplayUnlockCaptcha


// api: https://us-central1-password-request-system.cloudfunctions.net/api
// {
//   "name": "Anusorn Plaekjangreed",
//   "sendTo": "U92b72914aea86228e9ad305f3c087dc8"
// }



// api: https://us-central1-password-request-system.cloudfunctions.net/api/mail
// {
//   "code": "6633",
//   "email": "p_anusorn@kkumail.com"
// }


// api: https://us-central1-password-request-system.cloudfunctions.net/api/cancelEmail
// {
//   "email": "p_anusorn@kkumail.com"
// }


