// 申请屏幕截图权限
if (!images.requestScreenCapture()) {
    toast("申请屏幕截图权限失败");
    exit();
}

// 设置屏幕宽度和高度
setScreenMetrics(1080, 2460);

// 定义 OCR 识别的功能
function captureScreen() {
    return images.captureScreen();
}

function recognizeText(img, area) {
    return ocr(img, area);
}

function filterResults(results, keyword) {
    return results.filter(text => text.includes(keyword));
}

// 定义每一步的设置，数字数组, [ X 坐标, Y 坐标, 宽, 高 ]
const steps = [
    { area: [378, 510, 200, 100], keyword: "江湖", position: { x: 994, y: 566 } },  //关闭公告
    { area: [362, 2132, 200, 100], keyword: "进入", position: { x: 545, y: 2180 } },  //进入游戏
    { area: [320, 1950, 500, 100], keyword: "挑战", position: { x: 978, y: 2055 } },  //进入家族
    { area: [128, 1824, 200, 100], keyword: "砍一刀", position: { x: 251, y: 1869 } },  //进入砍一刀
    { area: [330, 1900, 420, 150], keyword: "砍一刀", position: { x: 568, y: 1971 } },  //砍一刀
];

// 定义功能模块
function executeSteps(steps) {
    let foundAllSteps = true;

    for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
        let img = captureScreen();
        let results = recognizeText(img, steps[stepIndex].area);
        
        log(`识别到的内容: ${JSON.stringify(results)}`);
        
        if (filterResults(results, steps[stepIndex].keyword).length > 0) {
            click(steps[stepIndex].position.x, steps[stepIndex].position.y);
            log(`点击了关键字 "${steps[stepIndex].keyword}" 对应的位置: (${steps[stepIndex].position.x}, ${steps[stepIndex].position.y})`);
            
            if (stepIndex === 1) {
                sleep(2000);
                click(817, 2150); // 点击空白处
                log(`完成点击`);
            }
            
            if (stepIndex === 4) {
                log("第四步成功执行，结束整个刀的操作");
                gesture(500, [50, device.height / 2], [device.width - 50, device.height / 2]);
                sleep(1000);
                click(555, 1470);
                break; // 退出步骤循环
            }
        } else {
            log(`未找到关键字 "${steps[stepIndex].keyword}"，准备滑动关闭应用`);
            gesture(500, [50, device.height / 2], [device.width - 50, device.height / 2]);
            sleep(1000);
            click(555, 1470);
            foundAllSteps = false;
            break; // 跳出当前步骤循环
        }
        sleep(2000); // 每一步之间等待2秒
    }
    
    return foundAllSteps;
}

// 主程序
launchApp("Clone App");
sleep(5000);
// 定义执行的刀数
const knifeActions = ["砍一刀", "砍两刀", "砍三刀", "砍四刀", "砍五刀", "砍六刀", "砍七刀", "砍八刀", "砍九刀", "砍十刀"];

for (let knife of knifeActions) {
    if (text(knife).waitFor()) {
        log(`找到账号 '${knife}'，准备点击...`);
        text(knife).click();
    } else {
        toast(`未找到账号 '${knife}'`);
        exit(); // 退出脚本
    }

    sleep(5000); // 等待公告加载
    // 判断是否游客登录
    let img = captureScreen();
    let results = recognizeText(img, steps[0].area);
    if (filterResults(results, steps[0].keyword).length === 0) {
        log(`游客登录`);
        click(781, 1447);
        sleep(2000);
}

    // 执行步骤
    if (!executeSteps(steps)) {
        sleep(3000); // 如果未找到所有步骤，等待3秒
    }
}
