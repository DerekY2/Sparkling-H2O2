import { setLocal, hideOverlays } from './popup.js'
import { TimetableTools, Overlays } from './constants.js';

function show(btn){
  TimetableTools.schoolSelect.value = btn.dataset.school;
  refresh(TimetableTools.schoolSelect.value)
  TimetableTools.overlay.classList.remove('hidden')
  Overlays.darkScreen.classList.remove("hidden");
  //console.log('timetable clicked:',btn.dataset.node,'via',btn.dataset.school,'-',btn)
}

function save(school=TimetableTools.schoolSelect.value, semester=TimetableTools.semesterSelect.value, year=TimetableTools.yearSelect.value, combined=TimetableTools.exportMode.checked){
  setLocal(school, [semester, year, combined])
  hideOverlays()
  //console.log('save request processed')
}

function refresh(key){
  chrome.storage.local.get([key], (result) => {
    const termData = result[key];
    //console.log('Getting:', key, ':', termData);
    if (termData) {
      //console.log('Found -', key, ':', 'semester:', termData[0], 'year:', termData[1]);
      TimetableTools.semesterSelect.value = termData[0];
      TimetableTools.yearSelect.value = termData[1];
      TimetableTools.exportMode.checked = termData[2]==undefined?true:termData[2]
      setState(key, [TimetableTools.semesterSelect.value, TimetableTools.yearSelect.value])
      //console.log('Set term/year to:', TimetableTools.semesterSelect.value, '/', TimetableTools.yearSelect.value);
    } else {
      setState(key, reset());
      save()
    }
  });
}

function setState(school, term) {
  let sem;
  switch (term[0]) {
    case '30':
      sem = 'Fall';
      break;
    case '20':
      sem = 'Summer';
      break;
    case '10':
      sem = 'Winter';
      break;
    default:
      console.error('Invalid semester code:', term[0]);
      return;
  }

  const targetState = document.querySelector(`.node-state[data-school="${school}"]`);

  if (targetState) {
    targetState.textContent = `${sem} ${term[1]}`;
  } else {
    console.error('Node state label not found for school:', school);
  }
}

function reset(){
  const defaultTerm = getDefaultTerm();
  //console.log('Using default term:', defaultTerm);
  TimetableTools.semesterSelect.value = defaultTerm[0];
  TimetableTools.yearSelect.value = defaultTerm[1];
  TimetableTools.exportMode.checked = defaultTerm[2]==undefined?true:defaultTerm[2]
  //console.log('New term:', [TimetableTools.semesterSelect.value, TimetableTools.yearSelect.value, TimetableTools.findTimetable.checked]);
  return defaultTerm
}

function getDefaultTerm() {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  let year = String(currentDate.getFullYear());
  let term;

  if (month >= 1 && month <= 3) {
    term = '10';
  } else if (month >= 3 && month <= 7) {
    term = '20';
  } else if (month >= 8 && month <= 10) {
    term = '30';
  } else if (month == 11) {
    term = '10';
    year = String(Number(year) + 1);
  } else {
    term = '10';
    console.error("ERROR: month not found. Default term is set to:", term, year, true);
  }

  //console.log("Default term is set to:", [term, year, false]);
  return [term, year, true];
}

function close(){
  TimetableTools.overlay.classList.add('hidden')
  Overlays.darkScreen.classList.add('hidden')
}

function init(){
  refresh('carleton')
  // refresh('ottawa')
  // refresh('waterloo')
}

export { save, refresh, reset, close, show, init }