var host = `3.96.133.132:8000` //AWS Cloud: 3.96.133.132:8000 // local: localhost:5000
var DEEPSEEK_V3, OLLAMA_R1, OPENAI_4O, OPEN_ROUTER, SERVER;

const messages = [];

const firstChat = document.querySelector('.temp-chat-new')
const firstSend = document.querySelector('.first-send')
const firstInput = document.querySelector('.first-input')

const chatWindow = document.querySelector('.main-chat')
const sendBtn = document.querySelector('.main-send')
const chatContainer = document.querySelector(".chat-container");
const inputBox= document.querySelector(".main-input");
const chatTitle= document.querySelector(".chat-title")
const changeModel=document.querySelectorAll(".change-model");
const modelIcon = document.querySelector(".model-icon")
const hostIcon = document.querySelector(".host-icon")
const policyBtn = document.querySelector(".privacy-policy-btn")
const localHostLabel = document.querySelector(".localhost-label")

// on submit, run sendMessage()
sendBtn.addEventListener("click", ()=>{
    // console.log('sending message');
    sendMessage(inputBox)
});

// on Enter, run sendMessage()
inputBox.addEventListener("keydown", function(e) {
    if (e.keyCode == 13 && !e.shiftKey && sendBtn.disabled==false) {
        e.preventDefault();
        sendMessage(inputBox);
    }
});

// first send/input, identical to main btns above
firstSend.addEventListener("click", ()=>{console.log('sending message');sendMessage(firstInput)});
firstInput.addEventListener("keydown", function(e) {if (e.keyCode == 13 && !e.shiftKey && sendBtn.disabled==false) {e.preventDefault();sendMessage(firstInput);}});

document.addEventListener("keydown", (e) => {
    // Regular expression to match typical English alphabet, numbers, spaces, and punctuation
    const validKeyRegex = /^[a-zA-Z0-9\s.,!?'"@#$%^&*()_+\-=\[\]{};:\\|<>\/~`]+$/;

    const ignoredKeys = [
        "CapsLock", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
        "Tab", "Shift", "Control", "Alt", "Meta", "Escape", "Enter", "Backspace", "Delete"
    ];

    // Check if the key matches the valid characters
    if (e.key.length == 1 && validKeyRegex.test(e.key) && !e.ctrlKey) {
        if (firstChat && !firstChat.classList.contains("hidden")) {
            firstInput.focus();
        } else {
            inputBox.focus();
        }
    }
});

changeModel.forEach(btn=>{
    btn.addEventListener("click",()=>{
        if(SERVER==OPEN_ROUTER){
            SERVER=OLLAMA_R1
        }
        else if(SERVER==OLLAMA_R1){
            SERVER=OPENAI_4O
        }
        else if(SERVER==OPENAI_4O){
            SERVER=DEEPSEEK_V3
        }
        else{
            SERVER=OPEN_ROUTER
        }
        updateChatTitle()
    })
})

hostIcon.addEventListener('click',()=>{
    host=='localhost:5000'?host='3.96.133.132:8000':host='localhost:5000'
    updateHost()
    updateChatTitle()
    updateRoutes()
    // console.log(host)
})

async function sendMessage(input) {

    // Grab user input
    const message = input.value.trim(); // take stored value as message to be sent
    
    // if the message is empty (i.e. nohing was typed, immediately exit function)
    if (!message) return;

    // Prevent use from sending anymore messages while the current message is being processed
    disable(true)

    // console.log(input.classList)
    if(input==firstInput){
        firstChat.classList.add('hidden')
        chatWindow.classList.remove('hidden')
    }
    // console.log(input.classList)

    // Create user chat bubble containing the message sent
    chatContainer.innerHTML += `<div class="user"><p>${message}</p></div>`;
    chatContainer.innerHTML += `<div class='chat-typing'><div class='model'><img src="assets/10x-favicon.png" alt="icon"><div class="loader model"></div></div><div>`;
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Reset input box
    input.value = "";
    // console.log(JSON.stringify({ message }))

    // Keep history of messages for logging purposes
    messages.push({role: "user", content: message})

    try {

        // async POST request using fetch, then save response to var 'response'
        const response = await fetch(SERVER, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        // console.log('POST\'d')

        // wait for response, then set to 'data'
        const data = await response.json();
        // console.log(data)
        // handle internal error within data
        if(data.error){
            chatContainer.innerHTML += `<div class="model"><img src="assets/10x-favicon.png" alt="icon"><div class="response-content">${data.error}</div></div>`;
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        // handle API overload
        else if(data.response.trim()==""){
            chatContainer.innerHTML += `<div class="error"><p>ERROR: API overloaded, please try again.</p></div>`;
        }

        // Clean data
        else{
            // Create AI chat bubble containing the response
            chatContainer.innerHTML += `<div class="model"><img src="assets/10x-favicon.png" alt="icon"><div class="response-content">${data.response}<div></div>`;
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        // push AI response
        messages.push({role: "system", content: data.response})
    } 
    // if error
    catch (error) {
        if (error.message === "Failed to fetch") {
            // chatContainer.innerHTML += `<div class="error"><p>${error}</p></div>`;
            chatContainer.innerHTML += `<div class="error"><p>ERROR: Unable to connect to the server.</p></div>`;
        } else {
            chatContainer.innerHTML += `<div class="error"><p>ERROR: ${error.message}</p></div>`;
        }
    }
    // Remove loader
    document.querySelector('.chat-container .chat-typing').remove()

    //re-enable form submit
    disable(false)
}

function disable(toggle){
    //disable submit
    if(toggle){
        sendBtn.disabled = true
        document.querySelector('.main-send i').classList.remove('bxs-send')
        document.querySelector('.main-send i').classList.add('bx-loader-alt')
        document.querySelector('.main-send i').classList.add('bx-spin')
    }
    //enable submit
    else{
        sendBtn.disabled = false
        document.querySelector('.main-send i').classList.remove('bx-loader-alt')
        document.querySelector('.main-send i').classList.remove('bx-spin')
        document.querySelector('.main-send i').classList.add('bxs-send')
    }
}

function updateChatTitle(){
    if(SERVER == OPEN_ROUTER){
        chatTitle.textContent = `OpenRouter: DeepSeek V3 (${host=='3.96.133.132:8000'?'AWS Cloud':'localhost'})`;
        modelIcon.src = "assets/deepseek-icon.png"
    }
    else if (SERVER == DEEPSEEK_V3) {
        chatTitle.textContent = `DeepSeek V3 (${host=='3.96.133.132:8000'?'AWS Cloud':'localhost'})`;
        modelIcon.src = "assets/deepseek-icon.png"
    } else if (SERVER == OLLAMA_R1) {
        chatTitle.textContent = `Ollama: Local PORT (${host=='3.96.133.132:8000'?'AWS Cloud':'localhost'})`;
        modelIcon.src = "assets/ollama-icon.png"

    } else if(SERVER == OPENAI_4O){
        chatTitle.textContent = `OpenAI: GPT-4o (${host=='3.96.133.132:8000'?'AWS Cloud':'localhost'})`;
        modelIcon.src = "assets/openai-icon.png"

    }
    else{
        chatTitle.textContent = "Unknown";
    }
}

function updateHost(){
    if(host=='localhost:5000'){
        hostIcon.classList.remove('bx-wifi')
        hostIcon.classList.add('bx-desktop')
        localHostLabel.classList.remove('hidden')
        policyBtn.classList.add('hidden')
    }   
    else if(host=='3.96.133.132:8000'){
        hostIcon.classList.remove('bx-desktop')
        hostIcon.classList.add('bx-wifi')
        policyBtn.classList.remove('hidden')
        localHostLabel.classList.add('hidden')
    }
}

function updateRoutes() {
    DEEPSEEK_V3 = `http://${host}/deepseek/v3`;
    OLLAMA_R1 = `http://${host}/ollama/deepseek/r1/7b`;
    OPENAI_4O = `http://${host}/openai/4o`;
    OPEN_ROUTER = `http://${host}/openrouter/deepseek/v3`;
    SERVER = OPEN_ROUTER; // Default to OPEN_ROUTER
}
function init(){
    updateHost()
    updateChatTitle()
    updateRoutes()
}
init()