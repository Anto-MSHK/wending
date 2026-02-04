const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const QUALITY = 80;
const MAX_WIDTH = 800;
const HERO_MAX_WIDTH = 1920;

async function optimizeImage(inputPath, outputPath, maxWidth, quality = QUALITY) {
    const ext = path.extname(outputPath).toLowerCase();

    let pipeline = sharp(inputPath)
        .resize(maxWidth, null, {
            withoutEnlargement: true,
            fit: 'inside'
        });

    if (ext === '.webp') {
        pipeline = pipeline.webp({ quality });
    } else if (ext === '.jpg' || ext === '.jpeg') {
        pipeline = pipeline.jpeg({ quality, mozjpeg: true });
    }

    const info = await pipeline.toFile(outputPath);

    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(`✅ ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
    console.log(`   ${(inputStats.size / 1024 / 1024).toFixed(2)} MB -> ${(outputStats.size / 1024).toFixed(0)} KB (${reduction}% reduction)`);
    console.log(`   Dimensions: ${info.width}x${info.height}`);
    console.log('');

    return info;
}

async function main() {
    console.log('🚀 Starting image optimization...\n');

    const publicDir = path.join(__dirname, '..', 'public');

    // Venue images - PNG to WebP
    const venues = [
        { input: 'images/venues/church.png', output: 'images/venues/church.webp' },
        { input: 'images/venues/restaurant.png', output: 'images/venues/restaurant.webp' },
        { input: 'images/venues/zags.png', output: 'images/venues/zags.webp' },
    ];

    console.log('📍 Optimizing venue images...\n');
    for (const venue of venues) {
        const inputPath = path.join(publicDir, venue.input);
        const outputPath = path.join(publicDir, venue.output);

        if (fs.existsSync(inputPath)) {
            await optimizeImage(inputPath, outputPath, MAX_WIDTH);
        } else {
            console.log(`⚠️ File not found: ${venue.input}`);
        }
    }

    // Hero photo - JPEG optimization
    console.log('🖼️ Optimizing hero photo...\n');
    const heroInput = path.join(publicDir, 'images/hero-photo.jpg');
    const heroOutput = path.join(publicDir, 'images/hero-photo-optimized.jpg');

    if (fs.existsSync(heroInput)) {
        await optimizeImage(heroInput, heroOutput, HERO_MAX_WIDTH, 85);
    }

    // Other images
    console.log('📸 Optimizing other images...\n');
    const otherImages = [
        { input: 'images/divider.png', output: 'images/divider.webp', maxWidth: 600 },
        { input: 'images/names.png', output: 'images/names.webp', maxWidth: 600 },
        { input: 'restaurant/res_4.png', output: 'restaurant/res_4.webp', maxWidth: 800 },
        { input: 'calendar.jpg', output: 'calendar-optimized.jpg', maxWidth: 1200 },
    ];

    for (const img of otherImages) {
        const inputPath = path.join(publicDir, img.input);
        const outputPath = path.join(publicDir, img.output);

        if (fs.existsSync(inputPath)) {
            await optimizeImage(inputPath, outputPath, img.maxWidth);
        } else {
            console.log(`⚠️ File not found: ${img.input}`);
        }
    }

    console.log('✨ Optimization complete!');
}

main().catch(console.error);
