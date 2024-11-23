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

// 定义 OCR 识别和点击的通用函数
function recognizeAndClick(area, keyword, clickCoords) {
    const img = captureScreen();
    const results = recognizeText(img, area);
    log(`OCR识别区域${JSON.stringify(area)}结果: ${JSON.stringify(results)}`);
    if (filterResults(results, keyword).length > 0) {
        click(clickCoords[0], clickCoords[1]);
        log(`点击坐标 (${clickCoords[0]}, ${clickCoords[1]})`);
        sleep(1000);
        return true;
    }
    return false;
}

// 登录模块
function login(account) {
    launchApp("Clone App");

    log(`准备选择账号 '${account}'...`);
    if (text(account).waitFor()) {
        log(`找到账号 '${account}'，准备点击...`);
        sleep(1000);
        text(account).click();
        sleep(5000); // 等待公告加载

        if (!recognizeAndClick([378, 510, 200, 100], "江湖", [781, 1447])) {
            log("游客登录");
            click(781, 1447);
            sleep(1000);
        }
        click(994, 566); // 点击关闭公告
        sleep(1000);
        click(545, 2180); // 点击进入游戏
        sleep(2000);
        click(975,1831); //点掉广告
        sleep(1000);
        click(511,489);
        sleep(1000);
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
        log("执行砍一刀");
        if (recognizeAndClick([320, 1950, 500, 100], "挑战", [978, 2055])) {
            sleep(2000);
            if (recognizeAndClick([128, 1824, 200, 100], "砍一刀", [251, 1869])) {
                sleep(2000);
                recognizeAndClick([330, 1900, 420, 150], "砍一刀", [589, 1971]);
                log("砍刀完成");
            }
        }
        log("已经砍刀，返回主界面");
        click(1006, 812); // 关闭砍一刀
        click(103, 270);  // 返回主界面
    },
    module2: () => {
        log("执行家族任务");
        if (recognizeAndClick([320, 1950, 500, 100], "挑战", [978, 2055])) {
            sleep(2000);
            click(475,1120); // 祭祀
            sleep(1000);
            for (let i = 0; i < 6; i++) {
                click(207, 2098); // 重复点击
                sleep(1000);
            }
            click(601,1333); // 领奖励
            sleep(1000);
            click(569,665); // 点掉框
            sleep(1000);
            click(800,1312); // 领奖励
            sleep(1000);
            click(569,665); // 点掉框
            sleep(1000);
            click(110,406); // 退出
            sleep(2000);
            click(322,1434); // 家族活动
            sleep(2000);
            click(570,818); // 拔河
            sleep(1000);
            click(581,1954); // 报名
            sleep(1000);
            click(1009,478); // 退出拔河
            sleep(2000);
            click(562,1187); // 除魔卫道
            sleep(1000);
            click(881,1625); // 助阵
            sleep(1000);
            click(794,1248); // 领奖励
            sleep(1000);
            click(569,665); // 点掉框
            sleep(1000);
            click(1001,440); // 退出除魔卫道
            sleep(1000);
            click(101,271); // 返回主界面
        }
        log("任务完毕，返回主界面");
        click(103, 270); // 返回主界面
    },
    module3: () => {
        log("执行门派日常");
        if (recognizeAndClick([320, 1950, 500, 100], "挑战", [855, 2363])) {
            sleep(2000);
            click(892,2178); // 日常
            sleep(1000);
            click(214,793); // 捐献六次
            for (let i = 0; i < 5; i++) {
                click(311,1778);
                sleep(800);
            }
            click(440,793); // 事务
            sleep(1000);
            click(570,1404); // 领叶子
            sleep(1000);
            click(570,1404); // 点掉框
            sleep(1000);
            click(678,793); // 俸禄
            sleep(1000);
            click(545,1980); // 领包子
            sleep(1000);
            click(570,1404); // 点掉框
            sleep(1000);
            click(1013,577); // 退出
            sleep(1000);
        }
        log("任务完毕，返回主界面");
        click(546,2356); // 回主界面

    },
    module4: () => {
        log("好友");
        if (recognizeAndClick([320, 1950, 500, 100], "挑战", [936,341])) {
            sleep(1000);
            click(878,1954); // 一键赠送
            sleep(1000);
            click(448,680); // 领取体力
            sleep(1000);
            click(558,1946); // 一键领取
            sleep(1000);
            click(1014,544); // 退出
        }
        log("任务完毕，返回主界面");
        click(103, 270); // 返回主界面
    },
};

// 使用选择框让用户选择要执行的模块
const moduleNames = ["砍一刀", "家族任务", "门派日常", "好友"];
const selectedIndices = dialogs.multiChoice("选择要执行的模块", moduleNames);

if (selectedIndices.length === 0) {
    toast("未选择任何模块");
    exit();
}

// 转换选择结果为模块编号
const selectedModules = selectedIndices.map(index => index + 1);
log("用户选择的模块编号: " + JSON.stringify(selectedModules));

// 遍历账号并依次执行选择的模块
for (let account of config.account) {
    if (login(account)) {
        selectedModules.forEach(module => {
            const moduleFunction = functions[`module${module}`];
            if (moduleFunction) {
                log(`开始执行模块: module${module}`);
                moduleFunction();
                sleep(2000);
            } else {
                log(`无效的模块编号: ${module}`);
            }
        });
        log('当前账号执行完毕，退出');
        gesture(500, [50, device.height / 2], [device.width - 50, device.height / 2]);
        sleep(2000);
        click(555, 1470);
    } else {
        log("登录失败，脚本结束");
        exit();
    }
}
