import { NextRequest, NextResponse } from 'next/server';

export interface MusicSearchResult {
    artist: string;
    track: string;
}

/**
 * Proxy to iTunes Search API for music autocomplete.
 * GET /api/music-search?q=query
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        return NextResponse.json({ results: [] });
    }

    try {
        const iTunesUrl = new URL('https://itunes.apple.com/search');
        iTunesUrl.searchParams.set('term', query);
        iTunesUrl.searchParams.set('entity', 'song');
        iTunesUrl.searchParams.set('limit', '8');
        iTunesUrl.searchParams.set('country', 'US');

        const response = await fetch(iTunesUrl.toString(), {
            headers: {
                'Accept': 'application/json',
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            console.error('iTunes API error:', response.status);
            return NextResponse.json({ results: [] });
        }

        const data = await response.json();

        const results: MusicSearchResult[] = (data.results || []).map((item: Record<string, unknown>) => ({
            artist: item.artistName as string,
            track: item.trackName as string,
        }));

        return NextResponse.json({ results });
    } catch (error) {
        console.error('Music search error:', error);
        return NextResponse.json({ results: [] });
    }
}
