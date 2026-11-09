import { WebSocket } from 'ws';
import http from 'http';
import fs from 'fs';
import { spawn } from 'child_process';

async function run() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless',
    '--disable-gpu',
    '--window-size=1440,900',
    '--remote-debugging-port=9231',
    'http://localhost:5179'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  http.get('http://localhost:9231/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
      const tabs = JSON.parse(data);
      const wsUrl = tabs[0].webSocketDebuggerUrl;
      const ws = new WebSocket(wsUrl);

      let msgId = 1;
      const send = (method, params = {}) => new Promise((resolve) => {
        const id = msgId++;
        const handler = (rawData) => {
          const res = JSON.parse(rawData);
          if (res.id === id) {
            ws.off('message', handler);
            resolve(res.result);
          }
        };
        ws.on('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });

      ws.on('open', async () => {
        await new Promise(r => setTimeout(r, 2000));

        // Click 'Accept 5 & Next Story'
        const acceptRes = await send('Runtime.evaluate', {
          expression: `
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Accept 5'));
            if (btn) {
              btn.click();
              'accepted-5';
            } else {
              'accept-btn-not-found';
            }
          `,
          returnByValue: true
        });
        console.log('Accept result:', acceptRes.result.value);

        await new Promise(r => setTimeout(r, 1500));

        // Open Backlog Drawer to show PAY-184 is now estimated with 5 pts badge!
        await send('Runtime.evaluate', {
          expression: `
            const backlogBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Backlog'));
            if (backlogBtn) backlogBtn.click();
          `
        });

        await new Promise(r => setTimeout(r, 1000));

        const backlogScreenshot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('/Users/layyzee/.gemini/antigravity/brain/45615f03-778e-4bc5-85ce-c92a43547f5c/sprintpoker_backlog_estimated.png', Buffer.from(backlogScreenshot.data, 'base64'));
        console.log('Saved sprintpoker_backlog_estimated.png');

        chrome.kill();
        process.exit(0);
      });
    });
  });
}

run();
