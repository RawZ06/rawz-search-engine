import {Document, JSDOM} from 'jsdom';
import {Result} from "../Result";
import * as fetch from 'node-fetch';
import {parse} from "../utils/url";

export class Google {

    private URL = 'https://google.fr/search';
    private userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'

    private fetch(query: string, start: number): Promise<string> {
        return fetch(`${this.URL}?q=${query}&start=${start}`, {
            headers: {
                'User-Agent': this.userAgent,
            }
        }).then((res) => {
            return res.text()
        })
    }

    private parseQueryToDocument(result: string): Promise<Document> {
        const dom = new JSDOM(result);
        return dom.window.document;
    }

    private extractResults(document: Document): Array<Result> {
        const main = document.querySelector('#main');
        const titles = [...main.querySelectorAll('.yuRUbf > a > h3')].map((el) => el.textContent);
        const links = [...main.querySelectorAll('.yuRUbf > a')].map((el) => el.href);
        const snippets = [...main.querySelectorAll('.g .VwiC3b')].map((el) => el.textContent);

        // const pages = [...main.querySelectorAll('.SJajHc')].map((el) => el.textContent);

        const organicResults = [];

        for (let i = 0; i < titles.length; i++) {
            organicResults.push({
                title: titles[i],
                link: links[i],
                snippet: snippets[i],
                url: parse(links[i])
            });
        }

        return organicResults;
    }

    private convertPageToStart(page: number): number {
        return (page - 1) * 10;
    }

    public async search(query: string, page = 1): Promise<Array<Result>> {
        const result = await this.fetch(query, this.convertPageToStart(page));
        const document = await this.parseQueryToDocument(result);
        return this.extractResults(document);
    }

    public async searchAll(query: string, page = 1): Promise<Array<Result>> {
        const results = [];
        for (let i=0; results.length < page*10; i++) {
            results.push(...await this.search(query, i));
        }
        return results.slice(0, page*10);
    }

    public async searchMock(_query: string, _page = 1): Promise<Array<Result>> {
        return [{
            "title": "DOFUS, le MMORPG stratégique.",
            "link": "https://www.dofus.com/",
            "snippet": "Plusieurs milliers de joueurs dans le monde. DOFUS est un jeu de rôle massivement multijoueur où le but est de retrouver les 6 précieux Dofus pour devenir ...",
            "url": parse("https://www.dofus.com/")
        }, {
            "title": "DOFUS Touch, un MMO colossal à portée de doigt !",
            "link": "https://www.dofus-touch.com/",
            "snippet": "DOFUS Touch est un jeu de rôle massivement multijoueur où le but est de retrouver les 6 précieux Dofus pour devenir maître d'Amakna.",
            "url": parse("https://www.dofus-touch.com/")
        }, {
            "title": "Dofus",
            "link": "https://fr.wikipedia.org/wiki/Dofus",
            "snippet": "Dofus (prononcé /do.fus/ ou /do.fys/) est un jeu de rôle en ligne massivement multijoueur (MMORPG) français développé et édité par Ankama puis par sa ...",
            "url": parse("https://fr.wikipedia.org/wiki/Dofus")
        }, {
            "title": "Dofus - JeuxOnLine",
            "link": "https://dofus.jeuxonline.info/",
            "snippet": "Fansite dédié à DOFUS MMO proposant des actualités régulières sur le jeu ainsi que des guides, tutoriels et informations sur les fonctionnalités et systèmes ...",
            "url": parse("https://dofus.jeuxonline.info/")
        }, {
            "title": "Dofus - Millenium",
            "link": "https://www.millenium.org/games/game-261",
            "snippet": "Vous ne comprenez pas à quoi servent les Osatons sur Dofus Temporis 7 ni comment en obtenir sur le nouveau serveur temporaire ? Suivez le guide. • 07 jui 2022.",
            "url": parse("https://www.millenium.org/games/game-261")
        }, {
            "title": "Dofus - YouTube",
            "link": "https://www.youtube.com/user/dofus",
            "snippet": "Bienvenue sur la chaîne officielle du jeu DOFUS !Suivez ici nos actualités DOFUS.Vous voulez plus d'informations ? Alors cliquez sur les liens ci-dessous :",
            "url": parse("https://www.youtube.com/user/dofus")
        }, {
            "title": "Dofus",
            "link": "https://www.twitch.tv/directory/game/Dofus?lang=fr",
            "snippet": "Regardez les chaînes live de Dofus sur Twitch. Inscrivez-vous ou connectez-vous pour rejoindre la communauté et suivre vos streamers de Dofus préférés !",
            "url": parse("https://www.twitch.tv/directory/game/Dofus?lang=fr")
        }]
    }
}