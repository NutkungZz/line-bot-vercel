const createQuickReplyMenu = () => ({
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
          color: '#FF6B6B' // Pantone Living Coral
        },
        {
          type: 'text',
          text: 'เลือกบริการที่ต้องการ',
          size: 'md',
          color: '#4ECDC4', // Pantone Lucite Green
          align: 'center',
          margin: 'md'
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
              color: '#45B7D1', // Pantone Scuba Blue
              action: {
                type: 'message',
                label: 'ตรวจสอบสถานะ MRM',
                text: 'สถานะ MRM'
              },
              height: 'sm'
            },
            {
              type: 'button',
              style: 'primary',
              color: '#98B4D4', // Pantone Serenity
              action: {
                type: 'message',
                label: 'รายงานปัญหา',
                text: 'รายงานปัญหา'
              },
              height: 'sm'
            },
            {
              type: 'button',
              style: 'primary',
              color: '#F7CAC9', // Pantone Rose Quartz
              action: {
                type: 'message',
                label: 'ข้อมูล MRM',
                text: 'ข้อมูล MRM'
              },
              height: 'sm'
            }
          ]
        }
      ],
      backgroundColor: '#2A363B' // Dark background
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'button',
          style: 'link',
          height: 'sm',
          action: {
            type: 'uri',
            label: 'เยี่ยมชมเว็บไซต์ MRM',
            uri: 'https://mrm.pea.co.th'
          },
          color: '#FF6B6B' // Pantone Living Coral
        }
      ],
      backgroundColor: '#2A363B' // Dark background
    }
  },
  quickReply: {
    items: [
      {
        type: 'action',
        imageUrl: 'https://img.icons8.com/fluency/48/000000/check-document.png',
        action: {
          type: 'message',
          label: 'ตรวจสอบสถานะ MRM',
          text: 'สถานะ MRM'
        }
      },
      {
        type: 'action',
        imageUrl: 'https://img.icons8.com/fluency/48/000000/error.png',
        action: {
          type: 'message',
          label: 'รายงานปัญหา',
          text: 'รายงานปัญหา'
        }
      },
      {
        type: 'action',
        imageUrl: 'https://img.icons8.com/fluency/48/000000/information.png',
        action: {
          type: 'message',
          label: 'ข้อมูล MRM',
          text: 'ข้อมูล MRM'
        }
      }
    ]
  }
});

module.exports = {
  createQuickReplyMenu
};
