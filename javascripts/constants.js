class Interface {
  // Header
  static popupLogo = document.getElementById("popup-logo-img1");
  // Body
  static nodes = document.querySelectorAll(".node");
  static staticNodes = document.querySelectorAll(".node.static.config");
  static nodeSelectors = document.querySelectorAll(".selector");
  static localSelectors = document.querySelectorAll(".local-selector");
  static configBtns = document.querySelectorAll(".config-btn");
  static nodeLists = document.querySelectorAll('.sub-menu a')
  // Footer
  static changePopupBtn = document.querySelector('.change-logo-btn');
  static showUpdates = document.querySelector('.show-version-details');
  static policyURL = 'https://github.com/DerekY2/ext-privacy-policies/blob/main/SPARKLING%20H2O2.md'
}

class Overlays {
  static allOverlays = document.querySelectorAll('.config-overlay');
  static darkScreen = document.querySelector(".dark-screen");
  static policyModal = document.querySelector(".privacy-policy-modal")
  // Buttons
  static infoBtns = document.querySelectorAll('.info-btn');
  static saveBtns = document.querySelectorAll('.config-save-btn');
  static resetBtns = document.querySelectorAll('.config-reset-btn');
  static presetBtns = document.querySelectorAll('.config-preset-btn');
  static closeBtns = document.querySelectorAll('.close-btn');
  static policyBtns = document.querySelectorAll('.config-policy-btn');
  static policyAgreementCheckbox = document.getElementById('policy-agreement-checkbox');
  static policyAgreementBtn = document.getElementById('policy-agreement-btn')
  // Sliders
  static sliders = document.querySelectorAll('.slider');
  static sliderInputs = document.querySelectorAll('.slider-textbox');
  static dropdownConfigSelectors = document.querySelectorAll('.dropdown-config-select');

  // Switches
  static switches = document.querySelectorAll('.toggle-switch')
}

class ReactionTime {
  static input = document.getElementById("reaction-time-input");
  static slider = document.querySelector(".slider-reaction-time");
  static rangeInput = document.getElementById("reaction-range-input");
  static overlay = document.querySelector(".reaction-time.config-overlay");
}

class ChimpTest {
  static overlay = document.querySelector(".chimp-test.config-overlay");
  static intervalSlider = document.getElementById("chimp-test-goal");
  static scoreSlider = document.getElementById('chimp-test-score');
  static intervalInput = document.getElementById("chimp-test-input");
  static scoreInput = document.getElementById('chimp-test-score-input');
  static autoSwitch = document.querySelector('#wait-for-first-click');
}

class TimetableTools {
  static semesterSelect = document.getElementById("semester-select");
  static yearSelect = document.getElementById("year-select");
  static overlay = document.querySelector(".timetable.config-overlay");
  static schoolSelect = document.getElementById("school-select");
  static exportMode = document.getElementById('export-mode')
  static policyURL = 'https://github.com/DerekY2/ext-privacy-policies/blob/main/SPARKLING%20H2O2.md#data-collection'
}

class Banners {
  static overlay = document.querySelector('.banner-overlay');
  static header = document.querySelector('.banner-header');
  static content = document.querySelector('.banner-content');
  static ok = document.querySelector('.banner-ok-btn');
  static screen = document.querySelector(".banner-screen");
}

// class Registry{
//   static carletonURLs = ['https://ssoman.carleton.ca/ssomanager/c/SSB?pkg=bwskfshd.P_CrseSchd', 'https://central.carleton.ca/prod/bwskfshd.P_CrseSchd', 'https://central.carleton.ca/prod/bwskfshd.P_CrseSchdDetl', 'armory/carleton-timetables.js']
// }

export {
  Interface,
  Overlays,
  ReactionTime,
  ChimpTest,
  TimetableTools,
  Banners
};