// ==UserScript==
// @name         RepoInfoAI
// @namespace    github.com/Person-0
// @version      2025-03-15
// @description  RepoInfo userscript for ChatGPT website.
// @author       Person-0
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

const HOST_URL = "http://127.0.0.1:4070";

unsafeWindow.document.addEventListener("DOMContentLoaded", function main(){
    let inProcess = false;
    const btn = document.createElement("div")
    btn.innerHTML = "RepoInfo"
    btn.setAttribute("style", `
    position: absolute;
    right: 3vw;
    bottom: 0.5vw;
    padding: 0.3vw;
    background: #9e259e;
    border-radius: 0.5rem;
    border: 1px solid #e700ff;
    text-shadow: 1px 1px 1px #d900ff;
    cursor: pointer;
    `)
    btn.onclick = processStart
    unsafeWindow.document.body.appendChild(btn)
    function processStart() {
        if(inProcess){return alert("Please wait, already processing data from previous prompt.")}
        const infoDiv = document.createElement("div")
        infoDiv.setAttribute("style",`position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        text-align: center;
        line-height: 100vh;
        font-size: 2vw;
        background: #000000c7`)
        unsafeWindow.document.body.appendChild(infoDiv)
        const repo = prompt("Enter Repo:")
        const search = prompt("What do you want to know about?")
        if(repo && search && repo.length > 3 && search.length > 2 && repo.includes("/")){
            infoDiv.innerHTML = "Fetching data..."
            fetch(`${HOST_URL}/process-repo?repo=${repo}&q=${search}`).then(res=>res.json()).then(async(res)=>{
                if(res.error){
                    infoDiv.innerHTML = "Error! Check console."
                    setTimeout(()=>{infoDiv.remove()},3e3)
                    console.log(res)
                    return
                }
                infoDiv.innerHTML = `Sending prompts (${0}/${res.parts.length+1})...`
                try{document.querySelector("button[data-testid*=new-chat-button]").click()}catch{}
                await asyncChatGPTSend(res.start)
                for(let i = 0; i < res.parts.length; i++){
                    infoDiv.innerHTML = `Sending prompts (${i+1}/${res.parts.length+1})...`
                    await asyncChatGPTSend(res.parts[i])
                    }
                asyncChatGPTSend(res.end)
                infoDiv.innerHTML = "Done!"
                setTimeout(()=>{infoDiv.remove()},250)
            }).catch(e=>{
                infoDiv.innerHTML = "Error! Check console."
                setTimeout(()=>{infoDiv.remove()},3e3)
                console.log(e)
            })
        } else {
            infoDiv.innerHTML = "Invalid information provided."
            setTimeout(()=>{infoDiv.remove()},1500)
        }
    }
})
function sendChatGPT(msg){
    const textArea = document.getElementById("prompt-textarea")
    if (!textArea) return console.error('Chatbar element not found!')
    const msgP = document.createElement('p'); msgP.textContent = msg
    textArea.querySelector('p').replaceWith(msgP)
    textArea.dispatchEvent(new Event('input', { bubbles: true }))
    setTimeout(function delaySend() {
        const sendBtn = document.querySelector("[data-testid=send-button]")
        if (!sendBtn?.hasAttribute('disabled')) {
            textArea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
        } else setTimeout(delaySend, 222)
    }, 222)
}
function asyncChatGPTSend(prompt) {
    return new Promise((resolve)=>{
        sendChatGPT(prompt)
        let genDone = false;
        setTimeout(()=>{const i = setInterval(()=>{
            if(!genDone && !(document.querySelector("button[data-testid=stop-button]"))){
                genDone = true
                clearInterval(i)
                resolve()
            }
        },100)},1000)
    })
}
function fetch(url, obj){
    let start = Date.now()
    let done = false
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            if(!done){reject("timeout while fetching "+url)}
        },15e3)
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: (data)=>{
                done = true
                if(data.readyState != 4){ return reject("Failed.") }
                resolve({
                    json:async()=>{return JSON.parse(data.response)},
                    text:async()=>{return data.response}
                })
            }
        })
    })

}
