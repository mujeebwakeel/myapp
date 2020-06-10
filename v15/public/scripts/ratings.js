var rating = Number(document.querySelector(".number-rating").textContent);
var innerStar = document.querySelector(".stars-inner");
var maxRating = 5;

getRating();

function getRating() {
	var starPercentage = (rating/maxRating)*100
innerStar.style.width = starPercentage + "%";
}