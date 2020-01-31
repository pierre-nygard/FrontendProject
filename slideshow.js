const slider = document.getElementById("slider");
var activeImageIndex;

function runApp() {
    loadSettings();
}

function goToImage(direction) {

    let images = document.getElementsByClassName('slider__image');

    images[activeImageIndex].classList.toggle('slider__image--active');

    activeImageIndex += direction;

    activeImageIndex = activeImageIndex < 0 ? images.length - 1 : activeImageIndex;
    activeImageIndex = activeImageIndex > images.length - 1 ? 0 : activeImageIndex;
    
    //alert(activeImageIndex);



    images[activeImageIndex].classList.toggle('slider__image--active');
}

function loadSettings() {
    let settingsurl = "/appsettings.json";

    fetch(settingsurl).
    then(response => response.json()).
    then(json =>  {
        for(var i = 0; i < json.image_count; i++) {
            let j = i;
            let backLink = document.createElement('a');
            backLink.classList.add('go-back');
            backLink.innerHTML = 'Go back';
            backLink.addEventListener("click", () => {
                goToImage(-1)
            });
                
            let nextLink = document.createElement('a');
            nextLink.classList.add('go-to-next');
            nextLink.innerHTML = 'Go to next';
            nextLink.addEventListener("click", () => {
                goToImage(1)
            });
                
            let image = document.createElement("div");
            image.classList.add('slider__image');
            image.dataset.image = i;
            image.style.backgroundImage = `url(${json[i].url})`;
            image.appendChild(backLink);
            image.appendChild(nextLink);

            if(image.dataset.image == json.starting_image) 
            {
                image.classList.add('slider__image--active');
                activeImageIndex = json.starting_image;
            }

            slider.appendChild(image);
        }
    });
}

document.onload = runApp();
