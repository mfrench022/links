let channelSlug = 'staying-in-style' // The “slug” is just the end of the URL.
let myUsername = 'michael-french' // For linking to your profile.

// I learned about Math.Random and other functions last year in creative coding class
// Here I am using a random integer function to define a min and max for the randomization, and then another function to add a random amount of divs to the HTML

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function blankDivsHTML(min = 0, max = 2) {
	let n = randInt(min, max)
	return `<div class="blank"></div>`.repeat(n)
}

// I wanted to add a custom play button as an inline SVG, but I didn't know how to do this with Javascript
// Found a stack overflow post that lead me to: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
// Here I am creating a variable that will hold the inline SVG

let PLAY_SVG = ""

// Setup Fetch function to return the SVG text in place of the file itself so that it can be inserted into the HTML (within JS) as a variable
function loadInlineSVG(url, className) {
return fetch(url)
	.then((r) => r.text())
	.then((svgText) => {

//Assign a class to the SVG so that I can style them with CSS
	return svgText.replace(
		"<svg",
		`<svg class="${className}" role="img" aria-label="Play" `
	)
	})
}

loadInlineSVG("play.svg", "play-icon").then((svg) => {
  PLAY_SVG = svg
})


// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (channelData) => {
	// Target some elements in your HTML:
	let channelTitle = document.querySelector('#channel-title')
	let channelDescription = document.querySelector('#channel-description')
	let channelCount = document.querySelector('#channel-count')
	let channelLink = document.querySelector('#channel-link')

	// Then set their content/attributes to our data:
	channelTitle.innerHTML = channelData.title
	channelDescription.innerHTML = channelData.description.html
	channelCount.innerHTML = channelData.counts.blocks
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}

// Then our big function for specific-block-type rendering:
let renderBlock = (blockData) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.querySelector('#content')

	// Links!
	if (blockData.type == 'Link') {
		// Declares a “template literal” of the dynamic HTML we want.
		let linkItem =
			`
			<div class="document">
				<figure>
					<picture>
						<source media="(width < 500px)" srcset="${ blockData.image.small.src_2x }">
						<source media="(width < 1000px)" srcset="${ blockData.image.medium.src_2x }">
						<img alt="${blockData.image.alt_text}" src="${ blockData.image.large.src_2x }">
					</picture>
				</figure>
			</div>
			${blankDivsHTML(0, 2)}
			`

		// And puts it into the page!
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)

		// More on template literals:
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
	}

	// Images!
	else if (blockData.type == 'Image') {
		let imageItem =
		`
			<div class="polaroid">
				<figure>
				<img class="polaroidcover" src="polaroid.svg"></img>
					<picture class="polaroidimg">
						<source media="(width < 500px)" srcset="${ blockData.image.small.src_2x }">
						<source media="(width < 1000px)" srcset="${ blockData.image.medium.src_2x }">
						<img alt="${blockData.image.alt_text}" src="${ blockData.image.large.src_2x }">
					</picture>
				</figure>
			</div>
			${blankDivsHTML(0, 2)}
			`

			channelBlocks.insertAdjacentHTML('beforeend', imageItem)
	}

	// Text!
	else if (blockData.type === "Text") {
		let html = blockData.content?.html ?? ""

		let textItem = `
		<div class="text">
		${html}
		</div>
		`

	channelBlocks.insertAdjacentHTML("beforeend", textItem)
}

	// Uploaded (not linked) media…
	else if (blockData.type == 'Attachment') {
		let contentType = blockData.attachment.content_type // Save us some repetition.

		// Uploaded videos!
		if (contentType.includes('video')) {
			// …still up to you, but we’ll give you the `video` element:
			let videoItem =

		`
			<div class="polaroid">
				<figure>
				<img class="polaroidcover" src="polaroid.svg"></img>
					<picture class="polaroidimg">
						<source media="(width < 500px)" srcset="${ blockData.image.small.src_2x }">
						<source media="(width < 1000px)" srcset="${ blockData.image.medium.src_2x }">
						<img alt="${blockData.image.alt_text}" src="${ blockData.image.large.src_2x }">
					</picture>
				</figure>
			</div>
			${blankDivsHTML(0, 2)}
		`

			channelBlocks.insertAdjacentHTML('beforeend', videoItem)
			// channelBlocks.insertAdjacentHTML('beforeend', videoItem)

			// More on `video`, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
		}

		// Uploaded PDFs!
		else if (contentType.includes('pdf')) {
			let pdfItem =
			`
			<div class="document">
				<figure>
					<picture>
						<source media="(width < 500px)" srcset="${ blockData.image.small.src_2x }">
						<source media="(width < 1000px)" srcset="${ blockData.image.medium.src_2x }">
						<img alt="${blockData.image.alt_text}" src="${ blockData.image.large.src_2x }">
					</picture>
				</figure>
			</div>
			${blankDivsHTML(0, 2)}
			`

		// And puts it into the page!
		channelBlocks.insertAdjacentHTML('beforeend', pdfItem)
		}

		// Uploaded audio!
		else if (contentType.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			let audioItem =
				`
				<li>
					<p><em>Audio</em></p>
					<audio controls src="${ blockData.attachment.url }"></video>
				</li>
				`

			channelBlocks.insertAdjacentHTML('beforeend', audioItem)

			// More on`audio`:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
		}
	}

	// Linked (embedded) media…
	else if (blockData.type == 'Embed') {
		let embedType = blockData.embed.type

		// Linked video!
		// Using SVG variable declared earlier to insert inline SVG
		if (embedType.includes("video")) {
			let linkedVideoItem = `
				<div class="polaroid withvideo">
				<figure>
					${PLAY_SVG || ""}

					<img class="polaroidcover" src="polaroid.svg" alt="">

					<picture class="polaroidimg">
					<source media="(width < 500px)" srcset="${blockData.image.small.src_2x}">
					<source media="(width < 1000px)" srcset="${blockData.image.medium.src_2x}">
					<img alt="${blockData.image.alt_text ?? ""}" src="${blockData.image.large.src_2x}">
					</picture>
				</figure>
				</div>
				${blankDivsHTML(0, 2)}
			`

  channelBlocks.insertAdjacentHTML("beforeend", linkedVideoItem)
}

		// Linked audio!
		else if (embedType.includes('rich')) {
			// …up to you!
		}
	}
}



// A function to display the owner/collaborator info:
let renderUser = (userData) => {
	let channelUsers = document.querySelector('#channel-users') // Container.

	let userAddress =
		`
		<address>
			<img src="${ userData.avatar }">
			<h3>${ userData.name }</h3>
			<p><a href="https://are.na/${ userData.slug }">Are.na profile ↗</a></p>
		</address>
		`

	channelUsers.insertAdjacentHTML('beforeend', userAddress)
}



// Finally, a helper function to fetch data from the API, then run a callback function with it:
let fetchJson = (url, callback) => {
	fetch(url, { cache: 'no-store' })
		.then((response) => response.json())
		.then((json) => callback(json))
}

// More on `fetch`:
// https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch

// Now that we have said all the things we *can* do, go get the channel data:
fetchJson(`https://api.are.na/v3/channels/${channelSlug}`, (json) => {
	console.log(json) // Always good to check your response!

	placeChannelInfo(json) // Pass all the data to the first function, above.
	renderUser(json.owner) // Pass just the nested object `.owner`.
})

// Get your info to put with the owner's:
fetchJson(`https://api.are.na/v3/users/${myUsername}/`, (json) => {
	console.log(json) // See what we get back.

	renderUser(json) // Pass this to the same function, no nesting.
})

// And the data for the blocks:
fetchJson(`https://api.are.na/v3/channels/${channelSlug}/contents?per=100&sort=position_desc`, (json) => {
	console.log(json) // See what we get back.

	// Loop through the nested `.data` array (list).
	json.data.forEach((blockData) => {
		// console.log(blockData) // The data for a single block.

		renderBlock(blockData) // Pass the single block’s data to the render function.
	})

	// I was having trouble getting my randomization to show up, so I used ChatGPT to troubleshoot.
	// I learned that Are.na content loads after DOM Content, so the random function didn't see any content to randomize.
	// By adding this if statement, I can call the randomization functions from my other JS file
	if (window.applyRandomRotations) window.applyRandomRotations()
})
