import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
// import dynamicImport from '../..';
import dynamicImport from 'vite-plugin-dynamic-import';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
	root: __dirname,
	plugins: [
		dynamicImport(),
		{
			name: 'vite-plugin-dynamic-import',
			transform(code, id) {
				if (/src\/main\.ts$/.test(id)) {
					// write transformed code to dist/
					const filename = id.replace('src', 'dist');
					const dirname = path.dirname(filename);
					if (!fs.existsSync(dirname)) fs.mkdirSync(dirname);
					fs.writeFileSync(filename, code);
				}
			},
		},
		createHtmlPlugin({
			minify: true,
			/**
			 * After writing entry here, you will not need to add script tags in `index.html`, the original tags need to be deleted
			 * @default src/main.ts
			 */
			entry: 'src/main.js',
			/**
			 * If you want to store `index.html` in the specified folder, you can modify it, otherwise no configuration is required
			 * @default index.html
			 */
			// template: 'public/index.html',

			/**
			 * Data that needs to be injected into the index.html ejs template
			 */
			inject: {
				data: {
					title: 'index',
					injectScript: `<script src="./inject.js"></script>`,
				},
				tags: [
					{
						injectTo: 'body-prepend',
						tag: 'div',
						attrs: {
							id: 'tag',
						},
					},
				],
			},
		}),
	],
	resolve: {
		alias: [
			{ find: '@', replacement: path.join(__dirname, 'src') },
			{ find: /^src\//, replacement: path.join(__dirname, 'src/') },
			{ find: '/root/src', replacement: path.join(__dirname, 'src') },
		],
	},
	build: {
		minify: false,
	},
});
