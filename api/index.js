const line = require('@line/bot-sdk');
const express = require('express');
const fetch = require('node-fetch');

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);
const app = express();

app.post('/api/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

async function checkMRMStatus() {
  try {
    const response = await fetch('https://mrm.pea.co.th');
    return response.ok ? "เว็บ MRM กำลังทำงานปกติค่ะ" : "เว็บ MRM มีปัญหาในการเข้าถึงค่ะ";
  } catch (error) {
    console.error('Error checking MRM status:', error);
    return "ไม่สามารถตรวจสอบสถานะเว็บ MRM ได้ในขณะนี้ค่ะ";
  }
}

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let reply_text = "ขอโทษค่ะ ฉันไม่เข้าใจคำสั่งนี้";

  if (event.message.text === "สถานะ server") {
    reply_text = "Server MRM กำลังทำงานปกติ";
  } else if (event.message.text === "เช็คสถานะเว็บ MRM") {
    reply_text = await checkMRMStatus();
  } else if (event.message.text === "รายงานปัญหา") {
    reply_text = "กรุณาแจ้งรายละเอียดปัญหาที่พบ";
  } else if (event.message.text.startsWith("ปัญหา:")) {
    console.log(`ได้รับรายงานปัญหา: ${event.message.text.slice(6)}`);
    reply_text = "ขอบคุณสำหรับการรายงานปัญหา ทีมงานจะรีบดำเนินการแก้ไขโดยเร็วที่สุด";
  } else if (event.message.text === "ความครบถ้วนของข้อมูล") {
    const completeness = 95; // ตัวอย่างค่า
    reply_text = `ความครบถ้วนของข้อมูล: ${completeness}%`;
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: reply_text
  });
}

module.exports = app;
