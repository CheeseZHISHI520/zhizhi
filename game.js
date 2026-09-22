// 读取本地宠物存档，没有存档就新建
let pet = JSON.parse(localStorage.getItem("myPetSave")) || {
    name: "小宠物",
    hungry: 100,
    mood: 100,
    exp: 0,
    stage: "baby" // baby幼体 / adult成年
};

// ========== 台词库，可以自己增删句子 ==========
const talkList = {
    baby: [
        "唔…有点饿啦",
        "摸摸我好不好🥺",
        "今天天气暖暖的",
        "你终于来看我啦",
        "好想被抱一抱",
        "咕噜咕噜~"
    ],
    adult: [
        "谢谢你一直陪着我",
        "吃饱了就很幸福",
        "安静地待在一起真好",
        "今天也要开开心心",
        "有你在就很安心",
        "轻轻靠过来吧"
    ]
};

// DOM元素
const petImg = document.getElementById("petImg");
const petNameEl = document.getElementById("petName");
const hungryEl = document.getElementById("hungry");
const moodEl = document.getElementById("mood");
const stageEl = document.getElementById("stage");
const bubbleEl = document.getElementById("bubble");

// 保存宠物数据到本地浏览器
function savePet() {
    localStorage.setItem("myPetSave", JSON.stringify(pet));
}

// 更新页面显示
function render() {
    petNameEl.innerText = pet.name;
    hungryEl.innerText = Math.round(pet.hungry);
    moodEl.innerText = Math.round(pet.mood);
    if(pet.stage === "baby"){
        stageEl.innerText = "幼体";
        petImg.src = "pet_baby.png";
    }else{
        stageEl.innerText = "成年";
        petImg.src = "pet_adult.png";
    }
}

// 显示气泡台词
function showTalk() {
    // 根据当前阶段挑选台词
    const list = talkList[pet.stage];
    const randomText = list[Math.floor(Math.random() * list.length)];
    bubbleEl.innerText = randomText;
    bubbleEl.classList.add("show");
    // 3秒后气泡消失
    setTimeout(()=>{
        bubbleEl.classList.remove("show");
    }, 3000);
}

// 喂食：增加饱食度，少量经验
document.getElementById("feedBtn").onclick = function(){
    pet.hungry = Math.min(100, pet.hungry + 25);
    pet.exp += 5;
    checkGrow();
    savePet();
    render();
    showTalk(); // 喂食触发说话
}

// 抚摸：增加心情，少量经验，触发抖动动画 + 说话
document.getElementById("touchBtn").onclick = function(){
    pet.mood = Math.min(100, pet.mood + 20);
    pet.exp += 3;
    petImg.classList.add("touch");
    setTimeout(()=>petImg.classList.remove("touch"),200);
    checkGrow();
    savePet();
    render();
    showTalk(); // 抚摸触发说话
}

// 成长判断：经验≥50升级成年
function checkGrow(){
    if(pet.exp >= 50 && pet.stage === "baby"){
        pet.stage = "adult";
    }
}

// 挂机自动衰减：每30秒饱食、心情缓慢下降
setInterval(()=>{
    pet.hungry = Math.max(0, pet.hungry - 1.5);
    pet.mood = Math.max(0, pet.mood - 1);
    savePet();
    render();
}, 30000);

// 随机自动冒泡：20~40秒随机弹出一句
function autoTalk(){
    const delay = 20000 + Math.random() * 20000;
    setTimeout(()=>{
        showTalk();
        autoTalk();
    }, delay);
}
autoTalk();

// 重置宠物（测试用按钮）
document.getElementById("resetBtn").onclick = function(){
    if(confirm("确定重置你的宠物吗？所有数据清空！")){
        localStorage.removeItem("myPetSave");
        pet = {
            name: "小宠物",
            hungry: 100,
            mood: 100,
            exp: 0,
            stage: "baby"
        };
        render();
        savePet();
    }
}

// 页面加载渲染一次
render();
