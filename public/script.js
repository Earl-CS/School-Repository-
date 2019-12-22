var path = window.location.pathname;
var page = path.split("/").pop();
console.log( page );

// if(page=="/"){
	$(function () {
	  $(document).scroll(function () {
	    var $nav = $(".navbar-fixed-top");
	    var $land = $(".landingContent");
	    $nav.toggleClass('scrolled', $(this).scrollTop() > $land.height());
	    //change $nav.height() to $land.height();
	  });
	});
// }

if(page=="places" || page=="addLocation" || page=='favorites' || page=='visited'){
 	var nav = document.querySelector("nav");
 	nav.classList.remove("navbar-fixed-top");

 	$(function () {
	    var $nav = $(".navbar");
	    $nav.toggleClass('scrolled', );
	    //change $nav.height() to $land.height();
	});

}


var landingContent = document.querySelector(".landingContent");
var generateButton = document.querySelector(".btn");

function onClick(){
	var num = Math.floor((Math.random() * 100) );
	console.log(num);
}

generateButton.addEventListener("click", onClick);

// generateButton.addEventListener("mouseover", function(){
// 	console.log("hey");
// 	landingContent.style.background = "url(images/beachTop.jpg)";
// });

window.onload = function () {

    function changeImage() {   
        var BackgroundImg=["images/beachTop.jpg",
            "images/lagoon.jpg",
            "images/manBoat.jpg",
            "images/cove.jpg",
            "images/horseBuilding.jpg",
            "images/moalboal.jpg"
        ];
        var i = Math.floor((Math.random() * 6));
        landingContent.style.backgroundImage = 'url("' + BackgroundImg[i] + '")';
    }
    window.setInterval(changeImage, 5000);
}

var generateSec = document.querySelector(".jumpTo");

generateSec.addEventListener('click', function(){
	$("html, body").animate({
		scrollTop:$("#generateSec").offset().top
	}, 1000);
});

if(visited==true){
	console.log("true");
}