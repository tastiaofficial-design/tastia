import { NextResponse, NextResponseInit } from 'next/server';

const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function mergeHeaders(init?: HeadersInit): Headers {
    const headers = new Headers(corsHeaders);

    if (init) {
        const incoming = new Headers(init);
        incoming.forEach((value, key) => headers.set(key, value));
    }

    return headers;
}

export function jsonWithCors(
    body: any,
    init?: NextResponseInit
): NextResponse {
    const headers = mergeHeaders(init?.headers);
    return NextResponse.json(body, { ...init, headers });
}

export function optionsResponse(): NextResponse {
    return new NextResponse(null, {
        status: 204,
        headers: mergeHeaders(),
    });
}

export { corsHeaders };

