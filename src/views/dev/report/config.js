const action = require( 'tempaw-functions' ).action;

module.exports = {
	livedemo: {
		enable: true,
		server: {
			baseDir: `dev/`,
			directory: false
		},
		port: 8000,
		open: false,
		notify: true,
		reloadDelay: 0,
		ghostMode: {
			clicks: false,
			forms: false,
			scroll: false
		}
	},
	sass: {
		enable: true,
		showTask: false,
		watch: `dev/**/*.scss`,
		source: `dev/**/!(_)*.scss`,
		dest: `dev/`,
		options: {
			outputStyle: 'expanded',
			indentType: 'tab',
			indentWidth: 1,
			linefeed: 'cr'
		}
	},
	pug: {
		enable: true,
		showTask: false,
		watch: `dev/**/*.pug`,
		source: [
			`dev/pages/!(_)*.pug`,
			`dev/documentation/!(_)*.pug`
		],
		dest: `dev/`,
		options: {
			pretty: true,
			verbose: true,
			self: true,
			emitty: true
		}
	},
	autoprefixer: {
		enable: false,
		options: {
			cascade: true,
			browsers: ['Chrome >= 45', 'Firefox ESR', 'Edge >= 12', 'Explorer >= 10', 'iOS >= 9', 'Safari >= 9', 'Android >= 4.4', 'Opera >= 30']
		}
	},
	watcher: {
		enable: true,
		watch: `dev/**/*.js`
	},
	lint: {
		showTask: true,
		sass: 'dev/components/!(bootstrap)/**/*.scss',
		pug: 'dev/**/*.pug',
		js: 'dev/**/!(*.min).js',
		html: 'dev/**/*.html'
	},
	buildRules: {
		'Build Dist': [
			// Clean dist
			action.clean({ src: 'dist' }),

			// Copy files to a temporary folder
			action.copy({
				src: [
					'dev/**/*.pug',
					'dev/**/*.scss',
					'dev/**/*.js'
				],
				dest: 'tmp'
			}),

			// Deleting code fragments
			action.delMarker({
				src: [
					'tmp/**/*.pug',
					'tmp/**/*.scss',
					'tmp/**/*.js'
				],
				dest: 'tmp',
				marker: 'DIST'
			}),

			// Compile sass
			action.sass({
				src: 'tmp/**/*.scss',
				dest: 'dist',
				autoprefixer: false
			}),

			// Compile pug
			action.pug({
				src: [
					`tmp/pages/!(_)*.pug`,
					`tmp/documentation/!(_)*.pug`
				],
				dest: 'dist',
				autoprefixer: false
			}),

			// Copy js files
			action.copy({
				src: 'tmp/**/*.js',
				dest: 'dist'
			}),

			// Copy fonts
			action.copy({
				src: [
					'dev/**/*.otf',
					'dev/**/*.eot',
					'dev/**/*.svg',
					'dev/**/*.ttf',
					'dev/**/*.woff',
					'dev/**/*.woff2'
				],
				dest: 'dist'
			}),

			// Copy & minify images
			action.minifyimg({
				src: [
					'dev/**/*.png',
					'dev/**/*.jpg',
					'dev/**/*.gif'
				],
				dest: 'dist'
			}),

			// Copy other files
			action.copy({
				src: [
					'dev/**/*.ico',
					'dev/**/*.php',
					'dev/**/*.json',
					'dev/**/*.txt'
				],
				dest: 'dist'
			}),

			// Delete temporary folder
			action.clean({ src: 'tmp' })
		],
		'Util Backup': [
			action.pack({
				src: [ 'dev/**/*', '*.*', '.gitignore' ], dest: 'versions/',
				name( dateTime ) { return `backup-${dateTime[0]}-${dateTime[1]}.zip`; }
			})
		]
	}
};
