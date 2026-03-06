import sharp from 'sharp';
import { stat } from 'fs/promises';
import { join, parse } from 'path';

const PUBLIC = 'e:/WebDev/wedding/public';

const toConvert = [
    ['images/DSC_7451-1.jpg', 1920],
    ['images/DSC_7709.jpg', 1920],
    ['images/DSC_7751-15.jpg', 1920],
    ['images/DSC_7775-18.jpg', 1920],
    ['images/hands.jpg', 1920],
    ['images/hero-photo_new.jpg', 1920],
    ['images/names_new.png', 800],
];

for (const [file, maxW] of toConvert) {
    const src = join(PUBLIC, file);
    const { dir, name } = parse(src);
    const dest = join(dir, `${name}.webp`);

    try {
        const srcStat = await stat(src);
        await sharp(src)
            .resize({ width: maxW, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(dest);

        const destStat = await stat(dest);
        console.log(`OK ${file}: ${(srcStat.size / 1024).toFixed(0)}KB -> ${(destStat.size / 1024).toFixed(0)}KB`);
    } catch (e) {
        console.error(`FAIL ${file}: ${e.message}`);
    }
}

console.log('\nDone!');
