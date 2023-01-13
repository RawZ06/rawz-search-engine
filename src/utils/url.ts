import * as Url from 'url-parse'

export function parse(url: string) {
    const parsed = new Url(url, true)
    return {
        domain: parsed.hostname,
        homepage: parsed.origin,
        path: parsed.pathname.split('/').filter(e => e),
    }
}