const path = require('path');

module.exports = {
	mode: 'production',
	entry: './public/main.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public/dist')
	}
};