let channelSlug = 'staying-in-style' // The “slug” is just the end of the URL.
let myUsername = 'michael-french' // For linking to your profile.

// I learned about Math.Random and other functions last year in creative coding class
// Here I am using a random integer function to define a min and max for the randomization, and then another function to add a random amount of divs to the HTML

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function blankDivsHTML(min = 0, max = 3) {
	let n = randInt(min, max)
	return `<div class="blank"></div>`.repeat(n)
}

// I wanted to write a function that would randomize the rotation angle of my blocks
// Reviewed materials from creative coding class last year and used ChatGPT to troubleshoot: https://taliacotton.notion.site/Javascript-Cheat-Sheet-5007bb6769c44a47991abb03b7aff177
// See line by line comments below for explanations


// Set up function to return a number within a min/max range (using a random floating point)
function randFloat(min, max) {
	return Math.random() * (max - min) + min
	}

// Limit function output to random numbers between -3 and 3 degrees, rounded to the nearest 0.1
function randomRotationDeg() {
	return Math.round(randFloat(-3, 3) * 10) / 10
	}
	
function randomTranslation() {
	return Math.round(randFloat(-3, 3) * 10) / 10
	}
	

// I wanted to be able to add a class to only one of my Arena block elements at a time
// I tried following the structure demonstrated in class for adding and removing a css class, but my result didn't work
// After troubleshooting with ChatGPT, I learned that I can use an event object (e) to help the event listener delegate what was clicked and where to apply the class

// Listening for a click on the event object
document.addEventListener('click', (e) => {
	// Declaring the nearest .item figure as the event object
	let item = e.target.closest('.item')

	// If the click is detected, do the following
	if (!item) return

	// Declaring variables for classes that I will add
	let polaroid = item.querySelector('.polaroid')
	let placeholder = item.querySelector('.placeholder')
	let caption = item.querySelector('.caption')

	// Adding classes which zoom in on the images, activate a placeholder to maintain the grid, and fly in a caption
	let polaroidOpen = polaroid.classList.toggle('open')
	placeholder.classList.toggle('placeholder-active', polaroidOpen)
	caption.classList.toggle('caption-active', polaroidOpen)
});

// Replicating function for documents
document.addEventListener('click', (e) => {
	let docItem = e.target.closest('.document-shadow')
	if (!docItem) return

	// These have a different HTML structure, so I am using the nextElementSibling to target siblings of the drop shadow div
	let docPlaceholder = docItem.nextElementSibling
	let docCaption = docPlaceholder.nextElementSibling

	if (!docPlaceholder.classList.contains('placeholder')) return
	if (!docCaption.classList.contains('caption')) return

	let documentOpen = docItem.classList.toggle('documentopen')
	docPlaceholder.classList.toggle('placeholder-active', documentOpen)
	docCaption.classList.toggle('caption-active', documentOpen)
});

// Replicating for text
document.addEventListener('click', (e) => {
	let textItem = e.target.closest('.textitem')

	if (!textItem) return

	let text = textItem.querySelector('.text')
	let textPlaceholder = textItem.querySelector('.placeholder')
	let textCaption = textItem.querySelector('.caption')

	let textOpen = text.classList.toggle('textopen')
	textPlaceholder.classList.toggle('placeholder-active', textOpen)
	textCaption.classList.toggle('caption-active', textOpen)
});



// Not using these so I am commenting out to avoid 

// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (channelData) => {

	// let channelTitle = document.querySelector('#channel-title')
	// let channelDescription = document.querySelector('#channel-description')
	// let channelCount = document.querySelector('#channel-count')
	// let channelLink = document.querySelector('#channel-link')

	// channelTitle.innerHTML = channelData.title
	// channelDescription.innerHTML = channelData.description.html
	// channelCount.innerHTML = channelData.counts.blocks
	// channelLink.href = `https://www.are.na/channel/${channelSlug}`
}

// Then our big function for specific-block-type rendering:
let renderBlock = (blockData) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.querySelector('#content')

	// Links!
	if (blockData.type == 'Link') {
		// Declares a “template literal” of the dynamic HTML we want.

		// Michael walked me through the style syntax to allow me to selectively apply the rotation class to different elements to randomly calculate their rotation

		let linkItem =
			`
			<div class="document-shadow" style="--rotation: ${randomRotationDeg()}deg; --translate: ${randomTranslation()}rem;">
				<div class="document">
						<picture>
							<source media="(width < 500px)" srcset="${ blockData.image.small.src_2x }">
							<source media="(width < 1000px)" srcset="${ blockData.image.medium.src_2x }">
							<img alt="${blockData.image.alt_text}" src="${ blockData.image.large.src_2x }">
						</picture>
				</div>
			</div>
			<div class="placeholder"></div>
			<figcaption class="caption" style="--rotation: ${randomRotationDeg()}">
				<h2>
					${ blockData.title
						? blockData.title // If `blockData.title` exists, do this.
						: `Untitled` // Otherwise do this.
					}
				</h2>

				<p>
					${ blockData.description // Here, checks for the object; could also write `blockData.description?.html`.
					? `<div>${blockData.description.html}</div>` // Wrap/interpolate the HTML.
					: `` // Our “otherwise” can also be blank!
					}
				</p>
			</figcaption>
			${blankDivsHTML(0, 3)}
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
			<figure class="item">
			<div class="polaroid" style="--rotation: ${randomRotationDeg()}deg; --translate: ${randomTranslation()}rem;">
				<img class="polaroidcover" src="polaroid.svg"></img>
					<picture class="polaroidimg">
						<source media="(width < 500px)" srcset="${ blockData.image.small.src_2x }">
						<source media="(width < 1000px)" srcset="${ blockData.image.medium.src_2x }">
						<img alt="${blockData.image.alt_text}" src="${ blockData.image.large.src_2x }">
					</picture>
			</div>
			<div class="placeholder"></div>
			<figcaption class="caption" style="--rotation: ${randomRotationDeg()}">
				<h2>
					${ blockData.title
						? blockData.title // If `blockData.title` exists, do this.
						: `Untitled` // Otherwise do this.
					}
				</h2>

				<p>
					${ blockData.description // Here, checks for the object; could also write `blockData.description?.html`.
					? `<div>${blockData.description.html}</div>` // Wrap/interpolate the HTML.
					: `` // Our “otherwise” can also be blank!
					}
				</p>
			</figcaption>
			</figure>
			${blankDivsHTML(0, 3)}
			`

			channelBlocks.insertAdjacentHTML('beforeend', imageItem)
	}

	// Text!
	else if (blockData.type === "Text") {
		let html = blockData.content?.html ?? ""

		let textItem = 
		`
		<figure class ="textitem">
		<div class="text" style="--rotation: ${randomRotationDeg()}deg; --translate: ${randomTranslation()}rem;">
		<p>
		${html}
		</p>
		</div>
		<div class="placeholder"></div>
		<figcaption class="caption" style="--rotation: ${randomRotationDeg()}">
			<h2>
				${ blockData.title
					? blockData.title // If `blockData.title` exists, do this.
					: `Untitled` // Otherwise do this.
				}
			</h2>

			<p>
				${ blockData.description // Here, checks for the object; could also write `blockData.description?.html`.
				? `<div>${blockData.description.html}</div>` // Wrap/interpolate the HTML.
				: `` // Our “otherwise” can also be blank!
				}
			</p>
		</figcaption>
		</figure>
		${blankDivsHTML(0, 3)}
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
			<figure class="item">
			<div class="polaroid withvideo" style="--rotation: ${randomRotationDeg()}deg; --translate: ${randomTranslation()}rem;">

			<svg width="105" height="133" class="template">
				<use href="#play"/>
			</svg>
			
				<img class="polaroidcover" src="polaroid.svg"></img>
					<picture class="polaroidimg">
						<source media="(width < 500px)" srcset="${ blockData.image.small.src_2x }">
						<source media="(width < 1000px)" srcset="${ blockData.image.medium.src_2x }">
						<img alt="${blockData.image.alt_text}" src="${ blockData.image.large.src_2x }">
					</picture>
			</div>
			<div class="placeholder"></div>
			<figcaption class="caption" style="--rotation: ${randomRotationDeg()}">
				<h2>
					${ blockData.title
						? blockData.title // If `blockData.title` exists, do this.
						: `Untitled` // Otherwise do this.
					}
				</h2>

				<p>
					${ blockData.description // Here, checks for the object; could also write `blockData.description?.html`.
					? `<div>${blockData.description.html}</div>` // Wrap/interpolate the HTML.
					: `` // Our “otherwise” can also be blank!
					}
				</p>
			</figcaption>
			</figure>
			${blankDivsHTML(0, 3)}
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
			<div class="document-shadow" style="--rotation: ${randomRotationDeg()}deg; --translate: ${randomTranslation()}rem;">
				<div class="document">
						<picture>
							<source media="(width < 500px)" srcset="${ blockData.image.small.src_2x }">
							<source media="(width < 1000px)" srcset="${ blockData.image.medium.src_2x }">
							<img alt="${blockData.image.alt_text}" src="${ blockData.image.large.src_2x }">
						</picture>
				</div>
			</div>
			<div class="placeholder"></div>
			<figcaption class="caption" style="--rotation: ${randomRotationDeg()}">
				<h2>
					${ blockData.title
						? blockData.title // If `blockData.title` exists, do this.
						: `Untitled` // Otherwise do this.
					}
				</h2>

				<p>
					${ blockData.description // Here, checks for the object; could also write `blockData.description?.html`.
					? `<div>${blockData.description.html}</div>` // Wrap/interpolate the HTML.
					: `` // Our “otherwise” can also be blank!
					}
				</p>
			</figcaption>
			${blankDivsHTML(0, 3)}
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
					// Here I am using the SVG literal that I declared earlier

	else if (blockData.type == 'Embed') {
		let embedType = blockData.embed.type

		// Linked video!
		if (embedType.includes("video")) {
			let linkedVideoItem = 
			`
				<figure class="item">
			<div class="polaroid withvideo" style="--rotation: ${randomRotationDeg()}deg; --translate: ${randomTranslation()}rem;">

			<svg width="105" height="133" class="template">
				<use href="#play"/>
			</svg>
			
				<img class="polaroidcover" src="polaroid.svg"></img>
					<picture class="polaroidimg">
						<source media="(width < 500px)" srcset="${ blockData.image.small.src_2x }">
						<source media="(width < 1000px)" srcset="${ blockData.image.medium.src_2x }">
						<img alt="${blockData.image.alt_text}" src="${ blockData.image.large.src_2x }">
					</picture>
			</div>
			<div class="placeholder"></div>
			<figcaption class="caption" style="--rotation: ${randomRotationDeg()}">
				<h2>
					${ blockData.title
						? blockData.title // If `blockData.title` exists, do this.
						: `Untitled` // Otherwise do this.
					}
				</h2>

				<p>
					${ blockData.description // Here, checks for the object; could also write `blockData.description?.html`.
					? `<div>${blockData.description.html}</div>` // Wrap/interpolate the HTML.
					: `` // Our “otherwise” can also be blank!
					}
				</p>
			</figcaption>
			</figure>
			${blankDivsHTML(0, 3)}
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

	// channelUsers.insertAdjacentHTML('beforeend', userAddress)
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
})
