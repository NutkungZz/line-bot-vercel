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
  const isGroupChat = event.source.type === 'group';

  // ถ้าเป็นแชทกลุ่ม ให้ตรวจสอบว่ามีการเรียกบอทหรือไม่
  let command = event.message.text;
  if (isGroupChat) {
    if (!command.toLowerCase().startsWith('บอท')) {
      return Promise.resolve(null);  // ไม่ตอบถ้าไม่ได้เรียกบอท
    }
    command = command.slice(3).trim();  // ตัดคำว่า "บอท" ออก
  }

  if (command === "สถานะ server") {
    reply_text = "Server MRM กำลังทำงานปกติ";
  } else if (command === "สถานะ MRM") {
    reply_text = await checkMRMStatus();
  } else if (command === "รายงานปัญหา") {
    reply_text = "กรุณาแจ้งรายละเอียดปัญหาที่พบ";
  } else if (command.startsWith("ปัญหา:")) {
    console.log(`ได้รับรายงานปัญหา: ${command.slice(6)}`);
    reply_text = "ขอบคุณสำหรับการรายงานปัญหา ทีมงานจะรีบดำเนินการแก้ไขโดยเร็วที่สุด";
  } else if (command === "ข้อมูล MRM") {
    const completeness = 100; // ตัวอย่างค่า
    reply_text = `ความครบถ้วนของข้อมูล: ${completeness}%`;
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: reply_text
  });
}

module.exports = app;
