const slider = $("#slider");
const buttons = document.getElementById("buttons__list");
var activeImageIndex;
var walkActive = false;
var isZoomed = false;
var zoomLocked = false;

function runApp() {
  loadSettings();
}

function goToImage(idx) {
  if (isZoomed) return false;
  walkActive = true;

  toggleSlide(idx);
  //toggleSlide(idx);

  setTimeout(() => {
    walkActive = false;
  }, 200);
  activeImageIndex = idx;
}

function toggleSlide(location) {
  let sliders = document.getElementsByClassName("slider__slide");
  let circles = document.getElementsByClassName("circle");
  //sliders[location].classList.toggle('slider__slide--active');
  circles[location].classList.toggle("circle--active");
  circles[activeImageIndex].classList.toggle("circle--active");
  console.log();
  slider.css("left", "-" + location * 100 + "%");
}

function loadSettings() {
  let settingsurl = "/appsettings.json";

  fetch(settingsurl)
    .then(response => response.json())
    .then(json => {
      activeImageIndex = json.starting_image;
      slider.css("width", json.image_count * 100 + "%");

      for (let i = 0; i < json.image_count; i++) {
        let slider__slide = document.createElement("div");
        let listItem = document.createElement("li");
        let span = document.createElement("span");

        let menu = document.createElement("div");

        span.classList.add("circle");
        listItem.addEventListener("click", () => goToImage(i));

        slider__slide.classList.add("slider__slide");
        slider__slide.dataset.slide = i;
        slider__slide.style.transform = "translate(" + i * 100 + "%, 0)";

        if (i == json.starting_image) {
          slider__slide.classList.add("slider__slide--active");
          span.classList.add("circle--active");
        }

        menu.innerHTML =
          `
            <div class="menu">
            <h1>${json[i].image_title}</h1> ` +
          `
            <p>${json[i].image_description}</p> 
            </div>
            `;

        slider__slide.innerHTML = `<div class="slider__front"></div>
            <div class="slider__image" data-image="${i}" style="background-image: url(${json[i].image_url})"></div> `;

        buttons.appendChild(listItem);
        listItem.appendChild(span);
        $("#slider").append(slider__slide);

        $("#slider").append(menu);
      }
    });
}

document.onload = runApp();

// Zoom event
document.onclick = e => {
  //console.log("entered");
  if (walkActive) return false;
  toggleZoom(e.clientX, e.clientY);
};

function toggleZoom(x, y) {
  let obj = $(".slider__image[data-image=" + activeImageIndex + "]");

  if (!isZoomed) {
    let origin = x + "px " + y + "px";
    obj.css("transform-origin", origin);
  }

  obj.toggleClass("slider__image--zoom");
  isZoomed = !isZoomed;
}
