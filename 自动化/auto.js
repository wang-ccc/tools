// 申请屏幕截图权限
if (!images.requestScreenCapture()) {
    toast("申请屏幕截图权限失败");
    exit();
}

// 读取配置文件
const configFilePath = "config.json"; // 替换为配置文件的实际路径
const config = JSON.parse(files.read(configFilePath));

// 设置屏幕宽度和高度
setScreenMetrics(config.screen.width, config.screen.height);

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

// 登录模块
function login(account) {
    launchApp("Clone App");

    log(`准备选择账号 '${account}'...`);
    if (text(account).waitFor()) {
        log(`找到账号 '${account}'，准备点击...`);
        text(account).click();
        sleep(5000); // 等待公告加载

        // 判断是否游客登录，并登录游戏
        log("准备进行 OCR 识别");
        let img = captureScreen();
        log("成功截取屏幕");
        let results = recognizeText(img, [378, 510, 200, 100]);
        log(`OCR识别结果: ${JSON.stringify(results)}`);
        if (filterResults(results, "江湖").length === 0) {
            log(`游客登录`);
            click(781, 1447); // 点击游客登录按钮
            sleep(500);
        }
        click(994, 566); // 点击关闭公告
        sleep(500);
        click(545, 2180); // 点击进入游戏
        sleep(2000);
        click(975,1831); //点掉广告
        sleep(500);
        click(511,489);
        sleep(500);
        click(975,1831);
        sleep(2000);
        return true; // 登录成功
    } else {
        toast(`未找到账号 '${account}'`);
        return false; // 登录失败
    }
}

// 定义功能模块
const functions = {
    module1: () => {
        log("执行功能模块1");
        img = captureScreen();
        results = recognizeText(img, [320, 1950, 500, 100]);
        log(`界面识别: ${JSON.stringify(results)}`);
        if (filterResults(results, "挑战").length > 0) {
            log(`当前位于主界面`);
            click(978, 2055); // 点击家族按钮
            sleep(2000);
            img = captureScreen();
            results = recognizeText(img, [128, 1824, 200, 100]);
            log(`家族界面识别: ${JSON.stringify(results)}`);
            if (filterResults(results, "砍一刀").length > 0) {
                click(251, 1869); // 点击砍一刀
                sleep(2000);
                img = captureScreen();
                results = recognizeText(img, [330, 1900, 420, 150]);
                log(`存在: ${JSON.stringify(results)}`);
                if (filterResults(results, "砍一刀").length > 0) {
                    click(589, 1971); // 挥刀
                    log("砍刀完成");
                }
            }
        }
        log("已经砍刀，返回主界面");
        click(1006, 812); // 关闭砍一刀
        click(103, 270); // 返回主界面
    },
    module2: () => {
        sleep(2000);
        log("执行功能模块2");
        img = captureScreen();
        results = recognizeText(img, [320, 1950, 500, 100]);
        log(`界面识别: ${JSON.stringify(results)}`);
        if (filterResults(results, "挑战").length > 0) {
            log(`当前位于主界面`);
            click(978, 2055); // 点击家族按钮
            sleep(2000);
            click(475,1120); //祭祀
            sleep(2000);
            click(207,2098);
            sleep(500);
            click(207,2098);
            sleep(500);
            click(207,2098);
            sleep(500);
            click(207,2098);
            sleep(500);
            click(207,2098);
            sleep(500);
            click(207,2098);
            sleep(500);
            click(601,1333); //领奖励
            sleep(500);
            click(569,665); //点掉框
            sleep(500);
            click(800,1312); //领奖励
            sleep(500);
            click(569,665); //点掉框
            sleep(500);
            click(110,406); //退出
            sleep(2000);
            click(322,1434); //家族活动
            sleep(2000);
            click(570,818); //拔河
            sleep(1000);
            click(581,1954); //报名
            sleep(500);
            click(1009,478); //退出拔河
            sleep(2000);
            click(562,1187); //除魔卫道
            sleep(1000);
            click(881,1625); //助阵
            sleep(500);
            click(794,1248); //领奖励
            sleep(500);
            click(569,665); //点掉框
            sleep(500);
            click(1001,440); //退出除魔卫道
            sleep(500);
            click(101,271); //返回主界面
        }
        log("任务完毕，返回主界面");
        click(103, 270); // 返回主界面
    },
    module3: () => {
        log("执行功能模块3");
        img = captureScreen();
        results = recognizeText(img, [320, 1950, 500, 100]);
        log(`界面识别: ${JSON.stringify(results)}`);
        if (filterResults(results, "挑战").length > 0) {
            log(`当前位于主界面`);
            click(855,2363); //门派
            sleep(2000);
            click(892,2178); //日常
            sleep(1000);
            click(214,793); //捐献
            sleep(500);
            click(311,1778);
            sleep(500);
            click(311,1778);
            sleep(500);
            click(311,1778);
            sleep(500);
            click(311,1778);
            sleep(500);
            click(311,1778);
            sleep(500);
            click(440,793); //事务
            sleep(500);
            click(570,1404); //领叶子
            sleep(500);
            click(570,1404); //点掉框
            sleep(500);
            click(678,793); //俸禄
            sleep(500);
            click(553,2986); //领包子
            sleep(500);
            click(570,1404); //点掉框
            sleep(500);
            click(1013,577); //退出
            sleep(500);
        }
        log("任务完毕，返回主界面");
        click(546,2356); //回主界面
    }
};

// 显示可选模块
log("请选择要执行的功能模块（用逗号分隔多个模块编号）：");
log("1. 功能模块1");
log("2. 功能模块2");
log("3. 功能模块3");

// 等待用户输入模块编号
let selectedModules = prompt("输入模块编号：").split(",").map(num => num.trim());

for (let account of config.account) { // 遍历所有账号
    if (login(account)) { // 调用登录函数
        for (let module of selectedModules) {
            switch (module) {
                case "1":
                    functions.module1();
                    break;
                case "2":
                    functions.module2();
                    break;
                case "3":
                    functions.module3();
                    break;
                default:
                    log(`无效的模块编号: ${module}`);
            }
        }
        log('当前账号执行完毕，退出')
        gesture(500, [50, device.height / 2], [device.width - 50, device.height / 2]);
        sleep(2000);
        click(555, 1470);
    } else {
        log("登录失败，脚本结束");
        exit(); // 退出脚本
    }
}
