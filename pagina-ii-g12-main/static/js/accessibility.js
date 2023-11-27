let font_size = localStorage.getItem("font_size")

if (!("font_size" in localStorage)) {
  localStorage.setItem("font_size","default")
}

const root = document.documentElement;
const slider = document.querySelector('#slider');
const pixel_display = document.querySelector('#pixel_display');
const defaul_button = document.querySelector('#reset_font_size')

const set_font_size = (size)=>{
  if (size === 18 || size === '18') {pixel_display.textContent = `Por defecto`;} else {pixel_display.textContent = `${size}px`;}
  root.style.setProperty('--font-size',`${size}px`);
}

if (font_size === 'default' || font_size === '18' || font_size === null) {
  set_font_size(18)
  slider.value = 18;
} else {
  slider.value = font_size;
  set_font_size(font_size)
};

let line_custom = document.querySelector(".line_custom");
max_value_custom = parseInt(slider.max)
min_value_custom = parseInt(slider.min)

line_custom.style.width = ((parseInt(slider.value) - min_value_custom)/(max_value_custom-min_value_custom))*100 + '%'


slider.oninput = ()=>{
  set_font_size(slider.value)
  localStorage.setItem("font_size",slider.value);

  max_value_custom = parseInt(slider.max);
  min_value_custom = parseInt(slider.min);

  line_custom.style.width = ((slider.value-min_value_custom)/(max_value_custom-min_value_custom))*100 + '%'
};

defaul_button.addEventListener('click',()=>{
  slider.value = 18
  set_font_size(18)
  localStorage.setItem("font_size",'default');
});