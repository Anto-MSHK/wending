import React from 'react';

/**
 * Love Story section with static content
 * AC: 4 - Display "Love Story" introductory text
 */
export function LoveStorySection() {
    return (
        <section className="py-16 px-6">
            <div className="max-w-[720px] mx-auto text-center">
                {/* Section Title */}
                <h2 className="font-cormorant text-[2rem] text-charcoal mb-8 flex items-center justify-center gap-3">
                    <span>💕</span>
                    <span>Love Story</span>
                </h2>

                {/* Story Content */}
                <div className="font-inter text-base text-charcoal leading-relaxed space-y-4">
                    <p>
                        Как мы встретились...
                    </p>
                    <p>
                        [Здесь будет ваша история любви - прекрасный рассказ о том, как вы нашли друг друга]
                    </p>
                </div>
            </div>
        </section>
    );
}
