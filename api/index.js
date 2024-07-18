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

function createButtonMenu() {
  return {
    type: 'flex',
    altText: 'เมนูการใช้งาน',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'เมนูการใช้งาน',
            weight: 'bold',
            size: 'xl',
            align: 'center'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            spacing: 'sm',
            contents: [
              {
                type: 'button',
                style: 'primary',
                action: {
                  type: 'message',
                  label: 'สถานะ MRM',
                  text: 'สถานะ MRM'
                }
              },
              {
                type: 'button',
                style: 'primary',
                action: {
                  type: 'message',
                  label: 'รายงานปัญหา',
                  text: 'รายงานปัญหา'
                }
              },
              {
                type: 'button',
                style: 'primary',
                action: {
                  type: 'message',
                  label: 'ข้อมูล MRM',
                  text: 'ข้อมูล MRM'
                }
              }
            ]
          }
        ]
      }
    }
  };
}

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let reply = { type: 'text', text: "ขอโทษค่ะ ฉันไม่เข้าใจคำสั่งนี้" };
  const isGroupChat = event.source.type === 'group';

  // ถ้าเป็นแชทกลุ่ม ให้ตรวจสอบว่ามีการเรียกบอทหรือไม่
  let command = event.message.text;
  if (isGroupChat) {
    if (!command.toLowerCase().startsWith('บอท')) {
      return Promise.resolve(null);  // ไม่ตอบถ้าไม่ได้เรียกบอท
    }
    command = command.slice(3).trim();  // ตัดคำว่า "บอท" ออก
  }

  switch (command) {
    case "เมนู":
      reply = createButtonMenu();
      break;
    case "สถานะ MRM":
      reply.text = await checkMRMStatus();
      break;
    case "รายงานปัญหา":
      reply.text = "กรุณาแจ้งรายละเอียดปัญหาที่พบ โดยพิมพ์: ปัญหา: [รายละเอียด]";
      break;
    case "ข้อมูล MRM":
      const completeness = 100; // ตัวอย่างค่า
      reply.text = `ความครบถ้วนของข้อมูล: ${completeness}%`;
      break;
    default:
      if (command.startsWith("ปัญหา:")) {
        console.log(`ได้รับรายงานปัญหา: ${command.slice(6)}`);
        reply.text = "ขอบคุณสำหรับการรายงานปัญหา ทีมงานจะรีบดำเนินการแก้ไขโดยเร็วที่สุด";
      }
  }

  return client.replyMessage(event.replyToken, reply);
}

module.exports = app;
