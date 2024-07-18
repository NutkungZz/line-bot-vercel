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
          color: '#FFFFFF'
        },
        {
          type: 'text',
          text: 'เลือกบริการที่ต้องการ',
          size: 'md',
          color: '#E0E0E0',
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
              style: 'secondary',
              color: '#FFFFFF',
              action: {
                type: 'message',
                label: '🔍 ตรวจสอบสถานะ MRM',
                text: 'สถานะ MRM'
              },
              height: 'sm'
            },
            {
              type: 'button',
              style: 'secondary',
              color: '#FFFFFF',
              action: {
                type: 'message',
                label: '🚨 รายงานปัญหา',
                text: 'รายงานปัญหา'
              },
              height: 'sm'
            },
            {
              type: 'button',
              style: 'secondary',
              color: '#FFFFFF',
              action: {
                type: 'message',
                label: 'ℹ️ ข้อมูล MRM',
                text: 'ข้อมูล MRM'
              },
              height: 'sm'
            }
          ]
        }
      ],
      backgroundColor: '#6247AA'
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
            label: '🌐 เยี่ยมชมเว็บไซต์ MRM',
            uri: 'https://mrm.pea.co.th'
          },
          color: '#FFFFFF'
        }
      ],
      backgroundColor: '#6247AA'
    }
  }
});

module.exports = {
  createQuickReplyMenu
};
