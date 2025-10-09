import pkg from '@openreplay/sourcemap-uploader';
import fs from 'node:fs';
import path from 'node:path';

const API_KEY = process.env.PRIVATE_OPR_API_KEY;
const PROJECT_KEY = process.env.PUBLIC_OPR_PROJECT_KEY;
const REVISION = process.env.PUBLIC_GITHUB_SHA;

if (!PROJECT_KEY || !REVISION) {
	console.error('Missing PRIVATE_OPR_API_KEY or PUBLIC_OPR_PROJECT_KEY');
	process.exit(1);
}

const uploadSourceMaps = async () => {
	console.log('Uploading sourcemaps...');

	const folders = ['chunks', 'entry', 'nodes'];
	for (const folder of folders) {
		const upload = await pkg.uploadDir(
			API_KEY,
			PROJECT_KEY,
			`./build/_app/immutable/${folder}`,
			`https://gcsbhelper.pages.dev/_app/immutable/${folder}`,
			'https://sink.mantan.dev/api'
		);
		console.log(folder, upload);
	}
};

const deleteMaps = (dir) => {
	console.log('Removing sourcemaps...');
	if (!fs.existsSync(dir)) return;
	fs.readdirSync(dir).forEach((file) => {
		const filepath = path.join(dir, file);
		if (file.endsWith('.map')) {
			fs.unlinkSync(filepath);
		} else if (fs.lstatSync(filepath).isDirectory()) {
			deleteMaps(filepath);
		}
	});
};

const uploadAndClean = async () => {
	await uploadSourceMaps();
	deleteMaps('./build');
	console.log('Done!');
	process.exit(0);
};

await uploadAndClean();
