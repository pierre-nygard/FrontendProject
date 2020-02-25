const slider = $("#slider");
const body = $("body");
const win = $("#window");
const buttons = $("#buttons__list");



var activeImageIndex;
var walkActive = false; // 1000ms time frame when image is sliding. State doesn't allow zooming
var isZoomed = false; // Active when image is zoomed. Doesn't allow new image slide until zoomed out.

function runApp() {
    loadSettings();
}

function goToImage(idx) {
    if (isZoomed) toggleZoom(0,0);
    walkActive = true;

    // Give body new background
    $('body').removeClass('body-'+activeImageIndex);
    $('body').addClass('body-'+idx);

    let circles = document.getElementsByClassName("circle");
    circles[idx].classList.toggle("circle--active");
    circles[activeImageIndex].classList.toggle("circle--active");
    slider.css("left", "-" + idx * 100 + "%");

    setTimeout(() => { walkActive = false}, 1000);

    activeImageIndex = idx;
}

function loadSettings() {
    
let settingsurl = "/appsettings.json";

    fetch(settingsurl)
    .then(response => response.json())
    .then(json => {

        activeImageIndex = json.starting_image;
        slider.css("width", json.image_count * 100 + "%"); 

        for (let i = 0; i < json.image_count; i++) {

        let image = json.images[i];           
        CreateAppend(i, json.starting_image, image);

        }

        $("body").toggleClass('body-'+ activeImageIndex);

    });
}

function CreateAppend(i, starting_image, image){

    let slider__slide = document.createElement("div");
        $(slider__slide).addClass("slider__slide");
            $(slider__slide).css("transform", "translate(" + i * 100 + "%, 0)");
                slider__slide.dataset.slide = i;

    let listItem = document.createElement("li");
        $(listItem).click(() => goToImage(i)); //Adding eventlisteners to all listItems

    let span = document.createElement("span");
        $(span).addClass("circle");
                                  
        if (i == starting_image) {
            $(slider__slide).addClass("slider__slide--active");
            $(span).addClass("circle--active");            
        }

    ChangeColorBg(i, image.color); 
    
    FillSlider_Slide(slider__slide, image.image_title, image.image_description, i, image.image_url);


    $(buttons).append(listItem);           
        $(listItem).append(span);        
            $("#slider").append(slider__slide);

}

function ChangeColorBg(index, imageColor){
    // Create background classes with each corresponding gradient
    $("<style type='text/css'> .body-" + index + "{ background: #" + imageColor + "</style>").appendTo("head");          
}

function FillSlider_Slide(slider__slide, image_title, image_description, i, image_url ){
    slider__slide.innerHTML = `
    <div class="slider__front">
        <div class="content">
            <div>
                <h1>${image_title}</h1> 
                <p>${image_description}</p> 
            </div>
        </div>
    </div>
    <div class="slider__image" data-image="${i}" style="background-image: url(${image_url})"></div> 
    `;
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
