import Image from 'next/image';

const photos = [
    { src: '/images/DSC_7451-1.jpg', alt: 'Антон и Ксения', rotate: '-12deg', translateY: '15px', zIndex: 10 },
    { src: '/images/DSC_7751-15.jpg', alt: 'Антон и Ксения', rotate: '2deg', translateY: '-20px', zIndex: 20 },
    { src: '/images/DSC_7775-18.jpg', alt: 'Антон и Ксения', rotate: '14deg', translateY: '15px', zIndex: 10 },
];

/**
 * Polaroid-style photo cards section
 * Displays three couple photos in elegant photo card frames
 * Uses clip-path to clip horizontal overflow only, preserving vertical shadows
 */
export function PhotoCards() {
    return (
        <section
            className="pt-6 md:pt-12 pb-8 md:pb-12 w-full relative z-20 -mb-16 md:-mb-24"
            style={{
                background: 'linear-gradient(to bottom, #000 0%, #000 20%, #fff 50%, #fff 100%)',
                overflowX: 'clip',
                overflowY: 'visible',
            }}
        >
            <div className="w-full">
                <div className="flex flex-row items-end justify-center -space-x-12 md:-space-x-20 px-4 w-full">
                    {photos.map((photo, index) => (
                        <div
                            key={index}
                            className="group relative"
                            style={{
                                transform: `rotate(${photo.rotate}) translateY(${photo.translateY})`,
                                transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                zIndex: photo.zIndex,
                            }}
                        >
                            {/* Polaroid frame */}
                            <div
                                className="bg-white p-2.5 pb-10 md:p-5 md:pb-20 shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.2)] transition-shadow duration-400"
                            >
                                {/* Photo */}
                                <div className="relative w-[160px] h-[215px] md:w-[320px] md:h-[430px] overflow-hidden">
                                    <Image
                                        src={photo.src}
                                        alt={photo.alt}
                                        fill
                                        className="object-cover grayscale-[10%]"
                                        sizes="(max-width: 768px) 140px, 280px"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
