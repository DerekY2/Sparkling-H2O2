import * as timetable from './timetable.js'
import * as reactionTime from './reactionTime.js'
import * as chimpTest from './chimpTest.js'
import * as carleton from './carleton-loader.js'
import { Interface, Overlays, Banners, TimetableTools } from './constants.js';

const save = {
  'timetable-tools': () => timetable.save(),
  'reaction-time': () => reactionTime.save(),
  'chimp-test': () => chimpTest.save()
};
const reset = {
  'timetable-tools': () => timetable.reset(),
  'reaction-time': () => reactionTime.reset(),
  'chimp-test': () => chimpTest.reset()
}
const preset = {
  'reaction-time': () => reactionTime.setFast(),
  'timetable-tools': (e) => timetable.refresh(e)
}
const close = {
  'timetable-tools': () => timetable.close(),
  'reaction-time': () => reactionTime.close(),
  'chimp-test': () => chimpTest.close()
}
const syncInput = {
  'reaction-time': () => reactionTime.syncInput(),
  'chimp-test': () => chimpTest.syncInput()
}
const syncSlider = {
  'reaction-time': () => reactionTime.syncSlider(),
  'chimp-test': () => chimpTest.syncSlider()
}

const refresh = {
  'carleton': (e) => timetable.refresh(e),
  'ottawa': (e) => timetable.refresh(e),
  'waterloo': (e) => timetable.refresh(e),
  'reaction-time': (e) => reactionTime.refresh(),
  'chimp-test': (e) => chimpTest.refresh(),
  'popup-icon-src':(e)=>refreshLogo()
}

const show = {
  'timetable-tools': (e) => timetable.show(e),
  'reaction-time': (e) => reactionTime.show(e),
  'chimp-test': (e) => chimpTest.show(e)
}

const loader={
  'carleton':(e)=> carleton.loader(e)
}

const policy = {
  'timetable-tools': ()=>{chrome.tabs.create({ url: TimetableTools.policyURL });},
  'interface': ()=>{chrome.tabs.create({ url: Interface.policyURL });}
}

// click listener & menu toggle - Interface.nodes
Interface.nodes.forEach(node => {
  node.addEventListener("click", (e)=>{
    const nodeParent = e.target.closest("li");
    //clog(selectionParent)
    nodeParent.classList.toggle("showMenu")
  })
})

// click listener & open options page
Interface.staticNodes.forEach(node => {
  node.addEventListener("click", (e)=>{
    chrome.runtime.openOptionsPage()
  })
})

// click listener - selectors
Interface.nodeSelectors.forEach(selector =>{
  selector.addEventListener("click", (e)=>{
    // Check if the click event originated from a config-btn
    if (e.target.closest(".config-btn")) {
      // If so, stop the event from propagating to the parent
      e.stopPropagation();
      return;
    }
    e.preventDefault
    if(selector.classList.contains('require-opened-cu')){
      loader['carleton'](selector)
    }else{
      if(selector.dataset.injection && selector.dataset.url){
        inject(selector.dataset.injection, selector.dataset.url)
      }
    }
  })
})

Interface.localSelectors.forEach(selector=>{
  selector.addEventListener("click", (e)=>{
    if (e.target.closest(".config-btn")) {
      // If so, stop the event from propagating to the parent
      e.stopPropagation();
      return;
    }
    e.preventDefault
    let url = chrome.runtime.getURL(selector.dataset.url)
    chrome.tabs.create({url})
  })
})

Overlays.saveBtns.forEach(b=>{
  b.addEventListener('click',()=>{
    save[b.dataset.node]()
  })
})

Overlays.resetBtns.forEach(b=>{
  b.addEventListener('click',()=>{
    reset[b.dataset.node]()
  })
})

Overlays.presetBtns.forEach(e=>{
  e.addEventListener('click',()=>{
    preset[e.dataset.node]()
  })
})

Overlays.closeBtns.forEach(e=>{
  e.addEventListener('click',()=>{
    close[e.dataset.node]()
  })
})

Interface.popupLogo.addEventListener('click',()=>{
  changeLogo()
  refreshLogo()
  //console.log('clicked')
})

Interface.changePopupBtn.addEventListener('click',()=>{
  changeLogo()
  refreshLogo()
})

Interface.configBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    //console.log(e)
    let configNode = btn.dataset.node
    //console.log('about to open -',configNode,'via',btn)
    show[btn.dataset.node](btn)
    // openOverlay(configNode, btn)
  });
});

Interface.nodeLists.forEach(b=>{
  b.addEventListener('mousedown', (e) => {
    // Check if the clicked element is the config-container or its child
    if (!e.target.closest('.config-btn')) {
      e.preventDefault()
      // Add the active class to scale and change color
      b.classList.add('force-active');
    }
  });

  b.addEventListener('mouseup', () => {
    // Remove the active class when the mouse button is released
    b.classList.remove('force-active');
  });
  b.addEventListener('mouseleave', () => {
    // Remove the active class when the mouse leaves the element
    b.classList.remove('force-active');
  });
})

Overlays.policyAgreementCheckbox.addEventListener('change',()=>{
  if(Overlays.policyAgreementCheckbox.checked){
    Overlays.policyAgreementBtn.disabled = false;
  }
  else{
    Overlays.policyAgreementBtn.disabled = true;
  }
})

Overlays.policyAgreementBtn.addEventListener('click',e=>{
  e.preventDefault()
  if(Overlays.policyAgreementCheckbox.checked){
    setLocal("privacy_policy_agreement", [Overlays.policyAgreementCheckbox.checked, new Date().toLocaleString('en-US', { timeZone: 'America/Toronto', hour12: false }), false]);
    Banners.screen.classList.add('hidden')
    Overlays.policyModal.classList.add('hidden');
  }
})

Overlays.infoBtns.forEach(btn=>{
  btn.addEventListener('click',e=>{
    e.preventDefault()
    e.stopPropagation()
    //console.log(e,'pressed')
    notify(btn.dataset.info)
  })
})

Overlays.policyBtns.forEach(b=>{
  b.addEventListener('click',e=>{
    policy[b.dataset.node]()
    //console.log("clicked",b.dataset.node)
  })
})

Overlays.dropdownConfigSelectors.forEach(e=>{
  e.addEventListener('change',()=>{
    preset[e.dataset.node](e.value)
  })
})

// Close the overlay when clicking outside of it
Overlays.darkScreen.addEventListener("click", () => {
  hideOverlays()
});

Banners.ok.addEventListener('click',()=>{
  hideBanner()
})

Banners.screen.addEventListener("click", (e) => {
  e.preventDefault()
  e.stopPropagation()
  //console.log('you shall not pass')
});

Overlays.sliders.forEach(s=>{
  s.addEventListener('input',()=>{
    syncSlider[s.dataset.node]()
  })
})

Overlays.sliderInputs.forEach(i=>{
  i.addEventListener('input',()=>{
    syncInput[i.dataset.node]()
  })
})

// listener - open updates.html when clicked
Interface.showUpdates.addEventListener('click',(e)=>{
  open(Interface.showUpdates.dataset.url)
  window.close()
})

function inject(file, request_url, checkOpen = false) {
  if (file) {
    if (checkOpen) {
      chrome.tabs.query({ currentWindow: true, url: request_url }, tabs => {
        if (tabs && tabs.length > 0) {
          const targetTab = tabs[tabs.length - 1].id;
          chrome.tabs.update(targetTab, { active: true });
          injectScript(targetTab, file);
        } else {
          chrome.tabs.create({ url: request_url }, tab => {
            injectScript(tab.id, file);
          });
        }
      });
    } else {
      chrome.tabs.create({ url: request_url }, tab => {
        injectScript(tab.id, file);
      });
    }
  }
}

function injectScript(tabId, file) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: [file]
  });
}

function open(request_url){
  if(request_url){
    chrome.tabs.query({'url':request_url}, tabs => {
      if(tabs.length>0){
        chrome.tabs.update(tabs[tabs.length-1].id, {active: true})
      }
      else{
        chrome.tabs.create({url: request_url})
      }
    })
  }
}

function refreshLogo(){
  if(Interface.popupLogo.src==chrome.runtime.getURL('images/Sparkle_Doll.png')){
    Interface.changePopupBtn.classList.add('bxs-color')
    Interface.changePopupBtn.classList.remove('bx-color')
    Interface.changePopupBtn.classList.remove('bxs-moon')
  }else if(Interface.popupLogo.src==chrome.runtime.getURL('images/pull-shark.png')){
    Interface.changePopupBtn.classList.add('bx-color')
    Interface.changePopupBtn.classList.remove('bxs-moon')
    Interface.changePopupBtn.classList.remove('bxs-color')
  }
  else if(Interface.popupLogo.src==chrome.runtime.getURL('images/sky-icon.png')){
    Interface.changePopupBtn.classList.add('bxs-moon')
    Interface.changePopupBtn.classList.remove('bxs-color')
    Interface.changePopupBtn.classList.remove('bx-color')
  }
}

function setLocal(key, val){
  chrome.storage.local.get(key, (result)=> {
    if (chrome.runtime.lastError) {
        console.error("Error retrieving key:", key, chrome.runtime.lastError);
        return;
    }
    const original = result[key]; // Retrieve the current value
    if(Array.isArray(original)&&Array.isArray(val)){
      var  eq=arraysEqual(original,val)
    }else{
      var eq=original===val
    }
    if (!eq) { // Only update if the value is different
      //console.log("About to save - ", original, " ==> ", val);
      chrome.storage.local.set({ [key]: val }, function() {
        if (chrome.runtime.lastError) {
          console.error("Error saving value:", key, chrome.runtime.lastError);
        }
        else{
          //console.log("Value saved successfully for", key, ":", val);
        }
        try{
          refresh[key](key)
        }
        catch(error){
          // console.error(`REFRESH ERROR FOR KEY ${key}:\n${error}`)
        }
      });
    } else {
      //console.log("No change detected. Value not updated for key:", key);
    }
  });
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

function notify(warning){
  Banners.overlay.querySelectorAll('.banner-title, .banner-msg').forEach((elem)=>{
    elem.classList.add('hidden')
    //console.log('added hidden class to - ',elem)
  })
  Banners.overlay.querySelectorAll(warning).forEach((elem)=>{
    elem.classList.remove('hidden')
    //console.log('remove hidden from - ',elem)
  })
  Banners.screen.classList.remove('hidden')
  Banners.overlay.classList.remove('hidden')
  //console.log('sent notification - ',warning)
}

function changeLogo(){
  if(Interface.popupLogo.src==chrome.runtime.getURL('images/pull-shark.png')){
    Interface.popupLogo.src=chrome.runtime.getURL('images/Sparkle_Doll.png')
    setLocal('popup-icon-src',['images/Sparkle_Doll.png','images/Sparkle_Doll128.png'])
    chrome.action.setIcon({path:'images/Sparkle_Doll128.png'})
    //console.log('changed icon tosparkle')
  }else if(Interface.popupLogo.src==chrome.runtime.getURL('images/Sparkle_Doll.png')){
    Interface.popupLogo.src=chrome.runtime.getURL('images/sky-icon.png')
    setLocal('popup-icon-src',['images/sky-icon.png','images/sky-icon128.png'])
    //console.log('changed icon to sky')
    chrome.action.setIcon({path:'images/sky-icon128.png'})
  }
  else if((Interface.popupLogo.src==chrome.runtime.getURL('images/sky-icon.png'))){
    Interface.popupLogo.src=chrome.runtime.getURL('images/pull-shark.png')
    setLocal('popup-icon-src',['images/pull-shark.png','images/pull-shark128.png'])
    chrome.action.setIcon({path:'images/pull-shark128.png'})
    //console.log('changed icon to pull')
  }
}

function hideOverlays(){
  Overlays.allOverlays.forEach(o => {
    if(!o.classList.contains('hidden'))
    o.classList.add('hidden');
  });
  Overlays.darkScreen.classList.add("hidden");
}

function hideBanner(){
  //console.log('Banner ok button click');
  Banners.overlay.classList.add("hidden");
  Banners.screen.classList.add("hidden");
  Banners.content.querySelector('.banner-placeholder').classList.remove('hidden')
  const helem=Banners.header.querySelector('.notif-header')
  const pelem = Banners.content.querySelector('.notif-content')
  if(helem){
    helem.remove()

  }
  if(pelem){
    pelem.remove()
  }
}

function init(){
  chrome.storage.local.get(['popup-icon-src', 'privacy_policy_agreement'],(result)=>{
    const r=result['popup-icon-src']
    const p=result['privacy_policy_agreement']
    if(r){
      Interface.popupLogo.src=chrome.runtime.getURL(r[0])
      chrome.action.setIcon({path:r[1]})
    }
    else{
      Interface.popupLogo.src=chrome.runtime.getURL('images/sky-icon.png')
      chrome.action.setIcon({path:'images/sky-icon128.png'})
    }
    refreshLogo()
    if(!p || !p[0]){
      Banners.screen.classList.remove('hidden')
      Overlays.policyModal.classList.remove('hidden')
      Overlays.policyAgreementBtn.disabled=true;
    }
  })
  timetable.init()
  reactionTime.init()
  chimpTest.init()
}
init()
export{ setLocal, notify, hideOverlays }