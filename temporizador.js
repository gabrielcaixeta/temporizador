const container_el = document.querySelector("#container");
const temporizador_el = document.querySelector("#temporizador");
const input_tempo_minutos = document.querySelector(
  "input[name='tempo_minutos']"
);
const tempo_minutos_alert = document.querySelector(
  "input[name='tempo_minutos_alert']"
);

document
  .querySelector("input[name='tempo_minutos']")
  .addEventListener("keyup", (event) => {
    event.stopPropagation();
  });
document
  .querySelector("input[name='tempo_minutos_alert']")
  .addEventListener("keyup", (event) => {
    event.stopPropagation();
  });

let time = 0;
let temporizador_is_active = null;

let is_paused = true;
let time_to_alert = 60;

const restarTemporizador = () => {
  time = parseInt(input_tempo_minutos.value) * 60;
  temporizador_el.innerHTML = formatIntToTime(time);
};

const initTemporizador = () => {
  if (temporizador_is_active == null) {
    temporizador_is_active = setInterval(() => {
      time -= 1;
      if (time <= time_to_alert) {
        temporizador_el.classList.add("alert");
      }

      if (time <= 0) {
        temporizador_el.classList.remove("alert");
        temporizador_el.classList.add("danger");
      }

      temporizador_el.innerHTML = formatIntToTime(time);
    }, 1000);
  }
};

const pause = (force = false) => {
  if (force) {
    if (!is_paused) {
      clearInterval(temporizador_is_active);
      temporizador_is_active = null;
    }
    is_paused = true;
    return;
  }
  is_paused = !is_paused;

  if (is_paused) {
    clearInterval(temporizador_is_active);
    temporizador_is_active = null;
  } else {
    initTemporizador();
  }
};

const formatIntToTime = (value) => {
  if (value < 0) {
    value *= -1;
  }
  const hour = parseInt(value / 60 / 60);
  const minutes = parseInt(value / 60);
  const seconds = value - hour * 60 * 60 - minutes * 60;
  const date = new Date(2024, 8, 1, hour, minutes, seconds);

  return date.toLocaleTimeString();
};

document.addEventListener(
  "keyup",
  (event) => {
    event.stopPropagation();

    console.log("event.code", event.code);

    if (event.code == "KeyF") {
      if (input_tempo_minutos.value == "") {
        input_tempo_minutos.style.borderColor = "red";
        return;
      }
      time = parseInt(input_tempo_minutos.value) * 60;

      if (!document.fullscreenElement) {
        time_to_alert = tempo_minutos_alert.value * 60;
        temporizador_el.innerHTML = formatIntToTime(time);
        container_el.classList.add("hide");
        temporizador_el.classList.remove("hide");
        temporizador_el.classList.remove("alert");
        temporizador_el.classList.remove("danger");
        temporizador_el.requestFullscreen();
      } else if (document.exitFullscreen) {
        clearInterval(temporizador_is_active);
        temporizador_is_active = null;
        container_el.classList.remove("hide");
        temporizador_el.classList.add("hide");
        document.exitFullscreen();
      }
    }

    if (event.code == "Space") {
      pause();
    }

    if (event.code == "KeyR") {
      pause(true);
      restarTemporizador();
      temporizador_el.classList.remove("alert");
      temporizador_el.classList.remove("danger");
    }
  },
  false
);
