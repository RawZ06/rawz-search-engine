import * as express from "express";
import {Google} from "../engines/Google";
import {calculateExpression} from "../tools/calculator";

const router: express.Router = express.Router();
const google = new Google();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/api/search', (req, res) => {
    if(!req.query.q) {
        res.status(400).send('Missing query parameter');
        return;
    }
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const query = req.query.q as string;
    google.search(query, page).then((results) => {
        res.send(results);
    });
});

router.get('/search', async (req, res) => {
    if(!req.query.q) {
        res.redirect('/');
        return;
    }
    if((req.query.q as string).trim().startsWith('!g')) {
        res.redirect(`https://google.fr/search?q=${(req.query.q as string).trim().substring(2)}`);
        return;
    }
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const query = req.query.q as string;
    const calculate = calculateExpression(query);
    google.searchAll(query, page).then((results) => {
        res.render('search', {results, query, calculate, page});
    });
});

export default router;