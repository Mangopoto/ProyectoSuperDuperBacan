let dark = localStorage.getItem("dark_mode");
const dark_toggle_icon = document.querySelector("#dark_toggle_icon")
const dark_toggle = document.querySelector("#dark_toggle");

const enable_dark = ()=>{
  dark_toggle_icon.innerHTML = 'light_mode';
  document.body.classList.add('darkmode');
  localStorage.setItem("dark_mode","on");
};
const disable_dark = ()=>{
  dark_toggle_icon.innerHTML = 'dark_mode';
  document.body.classList.remove('darkmode');
  localStorage.setItem("dark_mode",null);
};

if (dark === "on") {enable_dark()} else {disable_dark()}
dark_toggle.addEventListener('click', ()=>{
  dark = localStorage.getItem("dark_mode");
  if (dark !== "on") {enable_dark()} else {disable_dark()};
});