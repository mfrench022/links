// I wanted to write a function that would randomize the rotation angle of my blocks
// Reviewed materials from creative coding class last year and used ChatGPT to troubleshoot: https://taliacotton.notion.site/Javascript-Cheat-Sheet-5007bb6769c44a47991abb03b7aff177
// See line by line comments below for explanations


// Set up function to return a number within a min/max range (using a random floating point)
(function () {
function randFloat(min, max) {
	return Math.random() * (max - min) + min
	}

// Limit function output to random numbers between -3 and 3 degrees, rounded to the nearest 0.1
function randomRotationDeg() {
	return Math.round(randFloat(-3, 3) * 10) / 10
	}

// Applying the randomization function to the rotation(deg) CSS variable on the three class types that I am targeting
// By using forEach, I can make sure that items with the same class still have a unique random rotation
function applyRandomRotations() {
	const items = document.querySelectorAll(".document, .polaroid, .text")

	items.forEach((el) => {
		const deg = randomRotationDeg()

		el.style.transform = `rotate(${deg}deg)`
	})
	}

// Run the function on page load
window.addEventListener("DOMContentLoaded", applyRandomRotations)

// Not using this now but might add a button later to randomize layout
window.applyRandomRotations = applyRandomRotations
})()
