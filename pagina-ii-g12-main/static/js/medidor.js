let estado_microfono = false;
let medir_audio_toggle = true;
const button = document.querySelector('#mic_button');
const play_svg = document.querySelector('#play_svg');
const stop_svg = document.querySelector('#stop_svg');

let valor_calibrado_local = localStorage.getItem("valor_calibrado_local");
const calibrador = document.querySelector('#calibrador');
const valor_calibrado = document.querySelector('#valor_calibrado');

valor_calibrado.textContent = `${valor_calibrado_local}%`;
calibrador.value = valor_calibrado_local;

// creamos el canvas y modificamos el tamaño
const container = document.querySelector('#canvas_container')
const canvas = document.querySelector('#canvas_medidor')
let barra_altura;
const barra_anchura = 100
canvas.width = barra_anchura
container.offsetHeight = barra_anchura
canvas.height = container.offsetHeight
const ctx = canvas.getContext('2d');

const toggle_microfono = ()=>{
  if (!estado_microfono) {
    navigator.mediaDevices.getUserMedia({ audio:true }).then((audio_stream)=>{
      stream = audio_stream    
      // configuración del microfono
      const FFSIZE = 256
      const audio = new (window.AudioContext || window.webkitAudioContext)();
      const microfono = audio.createMediaStreamSource(stream);
      const detector = audio.createAnalyser();
      microfono.connect(detector);
    
      detector.fftSize = FFSIZE;
      const buffer_length = detector.frequencyBinCount;
      const data_array = new Uint8Array(buffer_length);
      // MAX_LEVEL, para que vaya que 0 a 100
      const MAX_LEVEL = 255 
      let nivel_sonido = 0

      medir_audio_toggle = true
    
      let medir_audio = ()=>{
        if (!medir_audio_toggle) {
          return;
        };
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        detector.getByteFrequencyData(data_array);
        // aqui conseguimos el nivel del sonido de 0 a 100 
        const nivel_sonidoPP = ((data_array.reduce((acc,val)=> acc+val, 0) / buffer_length)) 
        nivel_sonido = Math.round(nivel_sonidoPP*MAX_LEVEL/ FFSIZE * (calibrador.value / 100));
        
        barra_altura = (nivel_sonido*canvas.height)/MAX_LEVEL;
        ctx.fillRect(0, canvas.height - barra_altura, barra_anchura, barra_altura);
    
        // aqui se define que es alto, medio y bajo, junto con el color de la barra - no es final
        let target = 60;
        let ruido;

        // Initial setup
        if (currentContext === "Silencioso") {
            target = 30;
        } else if (currentContext === "Estandar") {
            target = 60;
        } else if (currentContext === "Ruidoso") {
            target = 80;
        } else if (currentContext === "Concierto") {
            target = 110;
        } else if (currentContext === "Personalizado") {
            target = parseInt(custom_range);
        };

        if (nivel_sonido > target + 20) {
            ruido = 'ALTO';
            ctx.fillStyle = 'red';
        } else if (nivel_sonido < target - 20) {
            ruido = 'BAJO';
            ctx.fillStyle = 'yellow';
        } else {
            ruido = 'PERFECTO!';
            ctx.fillStyle = 'green';
        }
        console.log(ruido)

        // esto es el texto que muestra el nivel del sonido
        document.querySelector('#sound_level').textContent = Math.round(nivel_sonido)+' - '+ruido;

        requestAnimationFrame(medir_audio);

      };
      medir_audio();
    }).catch((error)=>{
      console.error("No se pudo acceder al microfono.");
      document.querySelector('#sound_level').textContent = 'ERROR - Microfono no detectado.'
    });

    stop_svg.style.display = 'block';
    play_svg.style.display = 'none';
    estado_microfono = true;
  } else {
    if(stream) {
      const tracks = stream.getTracks();
      tracks.forEach(t => t.stop());
    };

    setTimeout(() => {
      medir_audio_toggle = false;
      ctx.clearRect(0,0,canvas.width,canvas.height)
      document.querySelector('#sound_level').textContent = "Apagado"
    }, 150);
    
    stop_svg.style.display = 'none';
    play_svg.style.display = 'block';
    estado_microfono = false;
  }
};

button.addEventListener('click', toggle_microfono);

if (!("valor_calibrado_local" in localStorage)) {
  localStorage.setItem("valor_calibrado_local",100)
  calibrador.value = 100
  valor_calibrado.textContent = `${calibrador.value}%`;
}

calibrador.addEventListener('input', function() {
  localStorage.setItem("valor_calibrado_local",calibrador.value);
  valor_calibrado.textContent = `${calibrador.value}%`;
});


let slider_boxes = document.querySelectorAll(".slider_box");

slider_boxes.forEach((box) => {
  let slider_value = box.querySelector(".slider_value");
  let slider_line = box.querySelector(".line");
  max_value = parseInt(slider_value.max);
  min_value = parseInt(slider_value.min);

  slider_line.style.width = ((parseInt(slider_value.value) - min_value)/(max_value-min_value))*100 + '%';

  slider_value.addEventListener('input', ()=>{
    max_value = parseInt(slider_value.max);
    min_value = parseInt(slider_value.min);
    console.log(slider_value.value);
    slider_line.style.width = ((slider_value.value-min_value)/(max_value-min_value))*100 + '%';
  });
});