const http = require('http');

async function inspectTab() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.url.includes('localhost:4173'));
  if (!tab) {
    console.log('Tab not found!');
    return;
  }
  console.log('Found tab:', tab.title, tab.webSocketDebuggerUrl);

  const ws = new WebSocket(tab.webSocketDebuggerUrl);

  ws.on('open', () => {
    // Evaluate script in the page
    const expr = `(() => {
      const allImgs = Array.from(document.querySelectorAll('img')).map(img => {
        const rect = img.getBoundingClientRect();
        return {
          src: img.src,
          alt: img.alt,
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY,
          width: rect.width,
          height: rect.height,
          visible: rect.width > 0 && rect.height > 0,
          parentTag: img.parentElement ? img.parentElement.tagName + '.' + img.parentElement.className : null
        };
      });
      const footer = document.querySelector('.site-footer');
      const footerRect = footer ? footer.getBoundingClientRect() : null;
      return {
        allImgs,
        footerRect: footerRect ? { top: footerRect.top + window.scrollY, bottom: footerRect.bottom + window.scrollY } : null,
        bodyHeight: document.body.scrollHeight,
        windowScrollY: window.scrollY
      };
    })()`;

    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: { expression: expr, returnByValue: true }
    }));
  });

  ws.on('message', (data) => {
    const res = JSON.parse(data.toString());
    if (res.id === 1) {
      console.log('RESULT:', JSON.stringify(res.result.value, null, 2));
      ws.close();
    }
  });
}

inspectTab().catch(console.error);
