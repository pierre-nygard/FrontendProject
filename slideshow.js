const slider = document.getElementById("slider");
const buttons = document.getElementById('buttons__list');
var activeImageIndex;
var walkActive = false;
var isZoomed    = false;
var zoomLocked  = false;

function runApp() {
    loadSettings();
}

function goToImage(idx) {
    if(isZoomed) return false;
    walkActive = true;

    toggleSlide(activeImageIndex);
    toggleSlide(idx);

    setTimeout(() => {walkActive = false}, 200);
    activeImageIndex = idx;
}

function toggleSlide(location) {
    let sliders = document.getElementsByClassName('slider__slide');
    let circles = document.getElementsByClassName('circle');
    sliders[location].classList.toggle('slider__slide--active');
    circles[location].classList.toggle('circle--active');
}

function loadSettings() {
    let settingsurl = "/appsettings.json";

    fetch(settingsurl).
    then(response => response.json()).
    then(json =>  {
        activeImageIndex = json.starting_image;
        
        for(let i = 0; i < json.image_count; i++) {
            let slider__slide = document.createElement('div');
            let listItem = document.createElement('li');
            let span = document.createElement('span');
            
            span.classList.add('circle');
            listItem.addEventListener('click', () => goToImage(i));

            slider__slide.classList.add('slider__slide');
            slider__slide.dataset.slide = i;

            if(i == json.starting_image){
                slider__slide.classList.add('slider__slide--active');
                span.classList.add('circle--active');
            }

            slider__slide.innerHTML = `
            <div class="slider__front">
                <div class="information">
                    <div class="information__heading">
                        <div class="title"><h1>${json[i].image_title}</h1></div>
                        <div class="information__description">${json[i].image_description}</div>
                    </div>
                </div>
            </div>
            <div class="slider__image" data-image="${i}" style="background-image: url(${json[i].image_url})"></div>
            `;

            buttons.appendChild(listItem);
            listItem.appendChild(span);
            $('#slider').append(slider__slide);
        }
    });
}

document.onload = runApp();

// On click event for zoom
document.onclick = (e) => {
    if(walkActive) return false;
    toggleZoom(e.clientX, e.clientY);
};

function toggleZoom(x, y) {
    let obj = $('.slider__image[data-image='+activeImageIndex+']');

    if(!isZoomed) {
        let origin = x+"px "+y+"px";
        obj.css("transform-origin", origin);
    }

    obj.toggleClass('slider__image--zoom');
    isZoomed = !isZoomed;
}