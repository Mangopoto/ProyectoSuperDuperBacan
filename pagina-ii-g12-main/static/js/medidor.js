let estado_microfono = false;
const button = document.querySelector('#mic_button');
const play_svg = document.querySelector('#play_svg');
const stop_svg = document.querySelector('#stop_svg');

// Example: Change the currentContext dynamically
currentContext = "Estandar"; // Change the context

const toggle_microfono = ()=>{
  if (!estado_microfono) {
    navigator.mediaDevices.getUserMedia({ audio:true }).then((audio_stream)=>{
      stream = audio_stream
      // creamos el canvas y modificamos el tamaño
      const container = document.querySelector('#canvas_container')
      const canvas = document.querySelector('#canvas_medidor')
      let barra_altura;
      const barra_anchura = 100
      canvas.width = barra_anchura
      container.offsetHeight = barra_anchura
      canvas.height = container.offsetHeight
      const ctx = canvas.getContext('2d');
    
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
      const MAX_LEVEL = 100 
      let nivel_sonido = 0
    
      let medir_audio = ()=>{
    
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        detector.getByteFrequencyData(data_array);
        // aqui conseguimos el nivel del sonido de 0 a 100 
        const nivel_sonidoPP = ((data_array.reduce((acc,val)=> acc+val, 0) / buffer_length)) 
        nivel_sonido = Math.round(nivel_sonidoPP*MAX_LEVEL/ FFSIZE)
        
        barra_altura = (nivel_sonido*canvas.height)/MAX_LEVEL;
        ctx.fillRect(0, canvas.height - barra_altura, barra_anchura, barra_altura);
    
        // aqui se define que es alto, medio y bajo, junto con el color de la barra - no es final
        let target = 25;

        // Initial setup
        if (currentContext === "Silencioso") {
            target = 10;
        } else if (currentContext === "Estandar") {
            target = 25;
        } else if (currentContext === "Ruidoso") {
            target = 40;
        } else if (currentContext === "Concierto") {
            target = 60;
        }

        if (nivel_sonido > target + 10) {
            ctx.fillStyle = 'red';
            ruido = 'ALTO';
        } else if (nivel_sonido < target - 10) {
            ctx.fillStyle = 'yellow';
            ruido = 'BAJO';
        } else {
            ctx.fillStyle = 'green';
            ruido = 'PERFECTO!';
        }

        // esto es el texto que muestra el nivel del sonido
        document.querySelector('#sound_level').textContent = Math.round(nivel_sonidoPP)+' - '+ruido;
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
    
    stop_svg.style.display = 'none';
    play_svg.style.display = 'block';
    estado_microfono = false;
  }
};

button.addEventListener('click', toggle_microfono);



