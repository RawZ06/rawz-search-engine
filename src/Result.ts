export type Result = {
    title: string;
    link: string;
    snippet: string;

    url: {
        domain: string;
        homepage: string;
        path: string[];
    }
}