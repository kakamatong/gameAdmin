const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // 监听控制台输出
    page.on('console', msg => {
      console.log('浏览器控制台:', msg.type(), msg.text());
    });
    
    // 监听页面错误
    page.on('pageerror', error => {
      console.error('页面错误:', error.message);
    });
    
    console.log('正在访问 http://localhost:3000/...');
    await page.goto('http://localhost:3000/', { 
      waitUntil: 'networkidle0',
      timeout: 10000
    });
    
    // 等待一点时间让JavaScript执行
    await page.waitForTimeout(2000);
    
    // 检查页面内容
    const content = await page.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.innerText,
        rootContent: document.getElementById('root') ? document.getElementById('root').innerHTML : 'root元素不存在',
        hasGameTitle: document.body.innerText.includes('游戏管理后台')
      };
    });
    
    console.log('页面标题:', content.title);
    console.log('页面是否包含游戏管理后台:', content.hasGameTitle);
    console.log('Root元素内容长度:', content.rootContent.length);
    
    if (content.hasGameTitle) {
      console.log('✓ 页面内容正确渲染');
    } else {
      console.log('✗ 页面内容未正确渲染');
      console.log('页面文本:', content.bodyText);
      console.log('Root内容:', content.rootContent);
    }
    
    // 截图保存
    await page.screenshot({ path: 'debug-screenshot.png' });
    console.log('页面截图已保存为 debug-screenshot.png');
    
  } catch (error) {
    console.error('测试出错:', error.message);
  } finally {
    await browser.close();
  }
})();