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

function createQuickReplyMenu() {
  return {
    type: 'flex',
    altText: 'MRM Monitor Menu',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'MRM Monitor',
            weight: 'bold',
            size: 'xl',
            align: 'center',
            color: '#FFD700'
          },
          {
            type: 'text',
            text: 'เลือกบริการที่ต้องการ',
            size: 'md',
            color: '#FFFFFF',
            align: 'center',
            margin: 'md'
          }
        ],
        backgroundColor: '#1E1E1E'
      }
    },
    quickReply: {
      items: [
        {
          type: 'action',
          action: {
            type: 'message',
            label: 'ตรวจสอบสถานะ MRM',
            text: 'สถานะ MRM'
          }
        },
        {
          type: 'action',
          action: {
            type: 'message',
            label: 'รายงานปัญหา',
            text: 'รายงานปัญหา'
          }
        },
        {
          type: 'action',
          action: {
            type: 'message',
            label: 'ข้อมูล MRM',
            text: 'ข้อมูล MRM'
          }
        }
      ]
    }
  };
}

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let reply;
  const isGroupChat = event.source.type === 'group';
  let command = event.message.text;

  if (isGroupChat) {
    if (!command.toLowerCase().startsWith('บอท')) {
      return Promise.resolve(null);
    }
    command = command.slice(3).trim();
  }

  switch (command) {
    case "เมนู":
      reply = createQuickReplyMenu();
      break;
    case "สถานะ MRM":
      reply = { type: 'text', text: await checkMRMStatus() };
      break;
    case "รายงานปัญหา":
      reply = { type: 'text', text: "กรุณาแจ้งรายละเอียดปัญหาที่พบ โดยพิมพ์: ปัญหา: [รายละเอียด]" };
      break;
    case "ข้อมูล MRM":
      const completeness = 100; // ตัวอย่างค่า
      reply = { type: 'text', text: `ความครบถ้วนของข้อมูล: ${completeness}%` };
      break;
    default:
      if (command.startsWith("ปัญหา:")) {
        console.log(`ได้รับรายงานปัญหา: ${command.slice(6)}`);
        reply = { type: 'text', text: "ขอบคุณสำหรับการรายงานปัญหา ทีมงานจะรีบดำเนินการแก้ไขโดยเร็วที่สุด" };
      } else {
        reply = createQuickReplyMenu();
      }
  }

  return client.replyMessage(event.replyToken, reply);
}

module.exports = app;
