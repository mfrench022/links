let channelSlug = 'staying-in-style' // The “slug” is just the end of the URL.
let myUsername = 'michael-french' // For linking to your profile.

// Per Michael's suggestion, I am setting up an intersection observer to mimic the desktop hover effects as user scrolls on mobile
// I used the class website example as a template, but after setting it up initially it was not observing any elements (essentially it was observing the page before the arena blocks were loaded) 
// After troubleshooting with ChatGPT, I learned that wrapping the observer in a function allows me to call the observer after the arena blocks are loaded into the DOM

function blockOneObserver() {
	let blocks = document.querySelectorAll('.block1') // Gets all of the elements with class .block1

	// This ensures that the observer takes place once the blocks are loaded
	if (!blocks.length) return 

	// Same setup as class website example, using for loop to go through all elements and add the class to those that intersect with the specified portion of the viewport
	let observerOne = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				entry.target.classList.toggle('block1hover', entry.isIntersecting)
			})
		},
		{
			rootMargin: '-45% 0px -55% 0px',
			threshold: 0,
		}
	)
	blocks.forEach((block) => observerOne.observe(block))
}

// Replicating for elements with different style structure
function blockTwoObserver() {
	let blocks = document.querySelectorAll('.block2')
	if (!blocks.length) return

	let observerOne = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				entry.target.classList.toggle('block2hover', entry.isIntersecting)
			})
		},
		{
			root: null,
			rootMargin: '-45% 0px -55% 0px',
			threshold: 0,
		}
	)
	blocks.forEach((block) => observerOne.observe(block))
}

// I learned about Math.Random and other functions last year in creative coding class
// Here I am using a random integer function to define a min and max for the randomization, and then another function to add a random amount of divs to the HTML

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function blankDivsHTML(min = 0, max = 2) {
	let n = randInt(min, max)
	return `<div class="blank"></div>`.repeat(n)
}

/** Here I want to insert random blank divs after every child of #content except the last. */
// I used ChatGPT to troubleshoot my function, which told me I needed to turn the children into a true array by using an elipse

// Same function setup as before
function insertBlanks(min = 0, max = 2) {
	let content = document.querySelector('#content')
	if (!content) return

	// By spreading the HTML collection into an Array, I'm essentially making a static snapshot of the original children that I can then insert random divs after
	let children = [...content.children]

	// Using a for loop here to target all children but the last
	for (let i = 0; i < children.length - 1; i++) {
		children[i].insertAdjacentHTML('afterend', blankDivsHTML(min, max))
	}
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
	return Math.round(randFloat(-5, 5) * 10) / 10
	}
	
function randomTranslation() {
	return Math.round(randFloat(-3, 3) * 10) / 10
	}


// I wanted to create a smooth view transition so it looks like the user is picking up the arena blocks
// I had to ask ChatGPT to figure out the best way to accomplish this using minimal JS

function withViewTransition(element, update, clearNamesAfter) {

	// Here we are targeting open elements (with the open card tag)
	if (element) element.style.viewTransitionName = 'open-card'
	if (document.startViewTransition) {
		// Here we are starting the view transition and waiting for it to finish
		let vt = document.startViewTransition(update)
		vt.finished.then(() => {

			// Clearing the view transition name when the transition is finished
			if (element) element.style.viewTransitionName = ''
			clearNamesAfter.forEach(el => { if (el) el.style.viewTransitionName = '' })
		})
	} else {
		// Fall back to a plain update() when the API isn’t available
		if (element) element.style.viewTransitionName = ''
		update()
	}
}


// I wanted to be able to add a class to only one of my Arena block elements at a time
// I tried following the structure demonstrated in class for adding and removing a css class, but my result didn't work
// After troubleshooting with ChatGPT, I learned that I can use an event object (e) to help the event listener delegate what was clicked and where to apply the class

// Revised function after talking to Michael, single click listener: only direct children of #content act as open/close toggles
// Did some troubleshooting with ChatGPT to figure out the best way to accomplish this; learned new concepts below
document.addEventListener('click', (e) => {
	// Here we are targeting the closest figure.item element to the clicked element
	let figure = e.target.closest('#content > figure.item')
	if (!figure) return

	// Here we are targeting the elements within the figure.item element that we want to apply the view transition to
	// The :scope selector is used to target the elements within the figure.item element. Without it, the selector would target the elements within the figure.item element and not the figure.item element itself
	let blur = document.querySelector('.blur')
	let target = figure.querySelector(':scope > :is(.polaroid, .document-shadow, .text, .audio)')
	let placeholder = figure.querySelector(':scope > .placeholder')
	let caption = figure.querySelector(':scope > .caption')

	// Here we are checking if the target, placeholder, and caption elements exist
	// The ! and || operators are used to check if the elements do not exist
	// If any of the elements do not exist, the function returns
	if (!target || !placeholder || !caption) return

	// Here we are checking if the placeholder element has the class placeholder-active
	if (placeholder.classList.contains('placeholder-active')) {
		placeholder.style.viewTransitionName = 'open-card-placeholder'
		caption.style.viewTransitionName = 'open-card-caption'
	}

	// Here we are applying the view transition to the target element and toggling a class so that the background doesn't move when elements are open
	// I also toggle a blur class so that the foreground stays sharp when elements are open
	withViewTransition(target, () => {
		let open = figure.classList.toggle('open')
		placeholder.classList.toggle('placeholder-active', open)
		caption.classList.toggle('caption-active', open)
		blur.classList.toggle('bluractive', open)

	// Toggling a class so that the background doesn't move when elements are open
	// I did it this way because these elements were not set up as a true modal
	document.body.classList.toggle('modal-open', document.querySelector('figure.item.open'))},
	
	// Last we are clearing the view transition name for the placeholder and caption elements
	[placeholder, caption])
})


// About the project modal adapted from course site
let modalButton = document.querySelector('#modal')
let modalDialog = document.querySelector('#dialog')
let closeModal = modalDialog.querySelector('#closebutton')

modalButton.addEventListener('click', () => {
	modalDialog.showModal()
})

closeModal.addEventListener('click', () => {
	modalDialog.close()
})


document.addEventListener('click', (event) => {
	if (event.target == document.documentElement) {
		modalDialog.close()
	}
})

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
			<figure class="item">
			<div class="document-shadow block2" style="--rotation: ${randomRotationDeg()}deg; --translate: ${randomTranslation()}rem;">
				<div class="document">
						<picture>
							<source media="(width < 500px)" srcset="${ blockData.image.small.src_2x }">
							<source media="(width < 1000px)" srcset="${ blockData.image.medium.src_2x }">
							<img alt="${blockData.image.alt_text}" src="${ blockData.image.large.src_2x }">
						</picture>
				</div>
			</div>
			<div class="placeholder container"></div>
			<figcaption class="caption container">
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
				<a href="${blockData.source.url}" target=_blank><button class="buttonstyle">Read More</button></a>
			</figcaption>
			</figure>
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
			<div class="polaroid block1" style="--rotation: ${randomRotationDeg()}deg; --translate: ${randomTranslation()}rem;">
				<img class="polaroidcover" src="polaroid.svg"></img>
					<picture class="polaroidimg">
						<source media="(width < 500px)" srcset="${ blockData.image.small.src_2x }">
						<source media="(width < 1000px)" srcset="${ blockData.image.medium.src_2x }">
						<img alt="${blockData.image.alt_text}" src="${ blockData.image.large.src_2x }">
					</picture>
			</div>
			<div class="placeholder container"></div>
			<figcaption class="caption container">
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
				<a href="https://www.are.na/block/${blockData.id }" target=_blank><button class="buttonstyle">More Info</button></a>
			</figcaption>
			</figure>
			`

			channelBlocks.insertAdjacentHTML('beforeend', imageItem)
	}

	// Text!
	else if (blockData.type === "Text") {
		let html = blockData.content?.html ?? ""

		let textItem = 
		`
		<figure class ="item">
		<div class="text block1" style="--rotation: ${randomRotationDeg()}deg; --translate: ${randomTranslation()}rem;">
		<p>
		${html}
		</p>
		</div>
		<div class="placeholder container"></div>
		<figcaption class="caption container">
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
			<a href="https://www.are.na/block/${blockData.id }" target=_blank><button class="buttonstyle">More Info</button></a>
		</figcaption>
		</figure>
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
			<div class="polaroid withvideo block1" style="--rotation: ${randomRotationDeg()}deg; --translate: ${randomTranslation()}rem;">

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
			<div class="placeholder container"></div>
			<figcaption class="caption container">
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
				<a href="${blockData.source.url}" target=_blank><button class="buttonstyle">Watch Video</button></a>
			</figcaption>
			</figure>
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
			<figure class = "item">
			<div class="document-shadow block2" style="--rotation: ${randomRotationDeg()}deg; --translate: ${randomTranslation()}rem;">
				<div class="document">
						<picture>
							<source media="(width < 500px)" srcset="${ blockData.image.small.src_2x }">
							<source media="(width < 1000px)" srcset="${ blockData.image.medium.src_2x }">
							<img alt="${blockData.image.alt_text}" src="${ blockData.image.large.src_2x }">
						</picture>
				</div>
			</div>
			<div class="placeholder container"></div>
			<figcaption class="caption container">
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
				<a href="https://www.are.na/block/${blockData.id }" target=_blank><button class="buttonstyle">Read More</button></a>
			</figcaption>
			</figure>
			`

		// And puts it into the page!
		channelBlocks.insertAdjacentHTML('beforeend', pdfItem)
		}

		// Uploaded audio!
		else if (contentType.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			let audioItem =
				`
			<figure class = "item">
			<div class="audio block2" style="--rotation: ${randomRotationDeg()}deg; --translate: ${randomTranslation()}rem;">
				<p>
					${ blockData.title
						? blockData.title // If `blockData.title` exists, do this.
						: `Untitled` // Otherwise do this.
					}
				</p>
				<img src="cd.png">
			</div>
			<div class="placeholder container"></div>
			<figcaption class="caption container">
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
				<a href="https://www.are.na/block/${blockData.id }" target=_blank><button class="buttonstyle">Listen</button></a>
			</figcaption>
			</figure>
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
			<div class="polaroid withvideo block1" style="--rotation: ${randomRotationDeg()}deg; --translate: ${randomTranslation()}rem;">

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
			<div class="placeholder container"></div>
			<figcaption class="caption container">
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
				<a href="${blockData.source.url}" target=_blank><button class="buttonstyle">Watch Video</button></a>
			</figcaption>
			</figure>
			`

  channelBlocks.insertAdjacentHTML("beforeend", linkedVideoItem)
}

		// Linked audio!
		else if (embedType.includes('rich')) {
			let linkedAudioItem = 
					`
			<figure class = "item">
			<div class="audio block2" style="--rotation: ${randomRotationDeg()}deg; --translate: ${randomTranslation()}rem;">
				<p>
					${ blockData.title
						? blockData.title // If `blockData.title` exists, do this.
						: `Untitled` // Otherwise do this.
					}
				</p>
				<img src="cd.png">
			</div>
			<div class="placeholder container"></div>
			<figcaption class="caption container">
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
				<a href="https://www.are.na/block/${blockData.id }" target=_blank><button class="buttonstyle">Listen</button></a>
			</figcaption>
			</figure>
				`

				  channelBlocks.insertAdjacentHTML("beforeend", linkedAudioItem)
		}
	}
}



// A function to display the owner/collaborator info:
// let renderUser = (userData) => {
// 	let channelUsers = document.querySelector('#channel-users') // Container.

// 	let userAddress =
// 		`
// 		<address>
// 			<img src="${ userData.avatar }">
// 			<h3>${ userData.name }</h3>
// 			<p><a href="https://are.na/${ userData.slug }">Are.na profile ↗</a></p>
// 		</address>
// 		`

// 	// channelUsers.insertAdjacentHTML('beforeend', userAddress)
// }



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
	insertBlanks(0, 2)
	blockOneObserver()
	blockTwoObserver()
})
