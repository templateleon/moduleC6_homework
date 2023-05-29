const wsUri = "wss://ws.postman-echo.com/raw";
const onOffBtn = document.getElementById("on_off");
const sendMsgBlock = document.querySelector(".send_message");
const sendBtn = document.getElementById("submit_btn");
const inputMsg = document.getElementById("input");
const screenStatus = document.getElementById("screen");
const screenShow = document.getElementById("screen_show");
const geoBtn = document.getElementById("geolocation");
const sendForm = document.getElementById("send_form");
let websocket;


// сообщение от сервера куда положить
function serverMsg(message) {
    let srvmsg = document.createElement("div");
    srvmsg.className = "srv_msg_style";
    const span = document.createElement("span");
    span.innerHTML = message;
    srvmsg.appendChild(span);
    // console.log("serverMsg", message);
    screenShow.appendChild(srvmsg);
}
// сообщение от пользователя куда положить
function userMsg(message) {
    let usrmsg = document.createElement("div");
    usrmsg.className = "usr_msg_style";
    const span = document.createElement("span");
    span.innerHTML = message;
    usrmsg.appendChild(span);
    // console.log("userMsg", message);
    screenShow.appendChild(usrmsg);
}

// обработка ссобщения от сервера
function acceptMessage() {
    if (websocket) {
        websocket.addEventListener("message", (event) => {
            const response = JSON.parse(event.data);
            serverMsg(response);
            console.log("Сообщение от сервера", response);
        });
    }
}
// кнопка включить включение
function onChat() {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(event) {
        screenStatus.style.background = "#E0FFFF";
        sendMsgBlock.style.display = "block";
        screenShow.style.display = "block";
        serverMsg("Готов к работе");
        // console.log(websocket);
        acceptMessage();
    };
    websocket.onerror = function(event) {
        serverMsg("Ошибка соединения");
    };
}
// кнопка включить отключение
function offChat() {
    websocket.close();
    websocket.onclose = function(event) {
        screenStatus.style.background = "#000000";
        websocket = null;
        sendMsgBlock.style.display = "none";
        screenShow.style.display = "none";
    };
    websocket.onerror = function(event) {
        serverMsg("Ошибка соединения");
    };
}
// отправка сообщения
function sendMessage() {
    if (inputMsg.value.trim() !== "") {
        websocket.send(JSON.stringify(inputMsg.value));
        userMsg(inputMsg.value);
        // console.log(inputMsg.value);
        inputMsg.value = "";
    }
}
// обработчик кнопки сообщения
sendBtn.addEventListener("click", () => {
    sendMessage();
    //   acceptMessage();
});
// обработчик кнопки включения
onOffBtn.addEventListener("click", () => {
    websocket ? offChat() : onChat();
});
// бработчик клавиши Enter лоя отправки сообщения
inputMsg.addEventListener("keydown", (event) => {
    if (event.code === "Enter" && inputMsg.value) {
        sendMessage();
    }
});
// прерывание "submit", а то у меня экран ссобщений вырубался
sendForm.addEventListener("submit", (event) => {
    event.preventDefault();
});

// Геолокация
// Ну тут все почти как на сайте SF рассказывали.

const error = () => {
    serverMsg("Невозможно получить ваше местоположение");
};

const success = (position) => {
    const { latitude, longitude } = position.coords;

    const geoLink = document.createElement("a");
    geoLink.setAttribute(
        "href",
        `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
    );
    const coords = `Широта ${latitude}<br>Долгота  ${longitude}<br>`;
    const lnk = `<a href="${geoLink}">Посмотреть на карте</a>`;
    // console.log(lnk)
    serverMsg(coords + lnk);
};

geoBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        serverMsg("Geolocation не поддерживается вашим браузером");
    } else if (websocket) {
        serverMsg("Определение местоположения");
        navigator.geolocation.getCurrentPosition(success, error);
    }
});