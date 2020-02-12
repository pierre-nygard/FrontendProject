const slider = $("#slider");
const win = $("#window");
const buttons = $("#buttons__list");

var activeImageIndex;
var walkActive = false; // 1000ms time frame when image is sliding. State doesn't allow zooming
var isZoomed = false; // Active when image is zoomed. Doesn't allow new image slide until zoomed out.

function runApp() {
    loadSettings();
}

function goToImage(idx) {
    if (isZoomed) return false;
    walkActive = true;

    let circles = document.getElementsByClassName("circle");
    circles[idx].classList.toggle("circle--active");
    circles[activeImageIndex].classList.toggle("circle--active");
    slider.css("left", "-" + idx * 100 + "%");

    setTimeout(() => { walkActive = false}, 1000);

    activeImageIndex = idx;
}

function toggleSlide(location) {
}

function loadSettings() {
    let settingsurl = "/appsettings.json";

    fetch(settingsurl)
    .then(response => response.json())
    .then(json => {
        activeImageIndex = json.starting_image;
        slider.css("width", json.image_count * 100 + "%");
        $(".credentials").css("color", json.color);

        for (let i = 0; i < json.image_count; i++) {
            let slider__slide = document.createElement("div");
            let listItem = document.createElement("li");
            let span = document.createElement("span");

            span.classList.add("circle");
            listItem.addEventListener("click", () => goToImage(i));

            slider__slide.classList.add("slider__slide");
            slider__slide.dataset.slide = i;
            slider__slide.style.transform = "translate(" + i * 100 + "%, 0)";

            if (i == json.starting_image) {
                slider__slide.classList.add("slider__slide--active");
                span.classList.add("circle--active");
            }

            slider__slide.innerHTML = `
            <div class="slider__front">
                <div class="content">
                    <h1>${json[i].image_title}</h1> 
                    <p>${json[i].image_description}</p> 
                </div>
            </div>
            <div class="slider__image" data-image="${i}" style="background-image: url(${json[i].image_url})"></div> 
            `;

            buttons.append(listItem);
            listItem.appendChild(span);

            $("#slider").append(slider__slide);
        }
    });
}

document.onload = runApp();

win.click((e) => {
    if (walkActive) return false;
    toggleZoom(e.clientX, e.clientY);
});

function toggleZoom(x, y) {
    let obj = $(".slider__image[data-image=" + activeImageIndex + "]");

    if (!isZoomed) {
        let origin = x + "px " + y + "px";
        obj.css("transform-origin", origin);
    }

    obj.toggleClass("slider__image--zoom");
    isZoomed = !isZoomed;
}
