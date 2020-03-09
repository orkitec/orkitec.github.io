var imagemin = require("imagemin"),    // The imagemin module.
  webp = require("imagemin-webp");

(async () => {
	const files = await imagemin(['assets/**/*.{jpg,png}'], {
		destination: 'assets/webp/',
		plugins: [
			webp({
                lossless: true // Losslessly encode images
            }),
			webp({
                quality: 65 // Quality setting from 0 to 100
              })
		]
	});

	console.log(files);
	//=> [{data: <Buffer 89 50 4e …>, destinationPath: 'build/images/foo.jpg'}, …]
})();

