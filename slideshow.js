const images = document.getElementsByClassName('slider__image');
const links = document.getElementsByClassName('go-to-next');

var activeImage = 1;

function goNext() {
    
}

for(var i = 0; i < links.length; i++)
{
    links[i].addEventListener("click", goNext)
}