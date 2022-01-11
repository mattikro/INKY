const express = require('express');
const router = express.Router();
const axios = require('axios').default;
const fs = require('fs')


router.get('/random/:seriesId', function (req, res, next) {
    getRandom(req.params['seriesId']).then(episode => {
        axios.post('http://' + vars()['roku']['ip'] + ':8060' + '/launch/291097?MediaType=movie&ContentID=' + episode['contentId'])
            .then(() => {
            }).catch(function (error) {
            console.log(error)
        });
    });
    res.send();
});


async function getRandom(seriesId) {
    let episodeData = new Promise((resolve) => {
        getEpisodes(seriesId).then(episodes => {
            let episode = episodes[Math.floor(Math.random() * episodes.length)];
            resolve(episode)
        });
    });
    return (episodeData)
}

async function getEpisodes(seriesId) {
    let data = [];
    let seriesData = await axios.get('https://disney.content.edge.bamgrid.com/svc/content/DmcSeriesBundle/version/5.1/region/CA/audience/false/maturity/1830/language/en/encodedSeriesId/' + seriesId);
    let seasons = seriesData.data['data']['DmcSeriesBundle']['seasons']['seasons']
    for (const season of seasons) {
        let episodesData = await axios.get('https://disney.content.edge.bamgrid.com/svc/content/DmcEpisodes/version/5.1/region/CA/audience/false/maturity/1830/language/en/seasonId/' + season['seasonId'] + '/pageSize/30/page/1');
        let episodes = episodesData.data['data']['DmcEpisodes']['videos'];
        episodes.forEach(episode => {
            data.push({
                'season': episode['seasonSequenceNumber'],
                'episode': episode['episodeSequenceNumber'],
                'title': episode['text']['title']['full']['program']['default']['content'],
                'contentId': episode['contentId']
            })
        });
    }
    return data
}

function vars() {
    return JSON.parse(fs.readFileSync('./vars.json'))
}

module.exports = router;

// router.get('/play/:contentId', function (req, res, next) {
//     //res.redirect('https://www.disneyplus.com/video/' + req.params['contentId']);
//     console.log(vars()['roku']['ip'])
//     axios.post('http://' + vars()['roku']['ip'] + ':8060' + '/launch/291097?MediaType=movie&ContentID=' + req.params['contentId'])
//         .then(() => {
//             res.send('done')
//         }).catch(function (error) {
//         console.log(error)
//         res.send(error);
//     });
// });
//
// router.get('/search/:search', function (req, res, next) {
//     updateVars()
//     search(req.params['search'], vars['disney']['token'])
//         .then((body) => {
//             res.send(body);
//         }).catch(error => {
//         search(req.params['search'])
//             .then((body) => {
//                 res.send(body);
//             }).catch(error => {
//             res.send(error);
//         })
//     });
//
// });
//
// async function search(search, token = null) {
//     if (token == null) token = await updateToken()
//     let res = await runSearch(search, token)
//     try {
//         let show = res.data['data']['search']['hits'][0]['hit']
//         let title = show['text']['title']['full']['series']['default']['content'];
//         let id = show['encodedSeriesId'];
//         let data = {
//             "title": title,
//             'id': id
//         }
//         return data
//     } catch (e) {
//         return 'no response'
//     }
// }
//
// async function runSearch(searchTerm, token) {
//     const config = {
//         method: 'get',
//         headers: {
//             'authority': 'disney.content.edge.bamgrid.com',
//             'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
//             'x-bamsdk-platform': 'macintosh',
//             'x-dss-edge-accept': 'vnd.dss.edge+json; version=2',
//             'x-bamsdk-client-id': 'disney-svod-3d9324fc',
//             'x-application-version': '1.1.2',
//             'sec-ch-ua-mobile': '?0',
//             'authorization': 'Bearer ' + token,
//             'x-bamsdk-version': '12.0',
//             'accept': 'application/json',
//             'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
//             'sec-ch-ua-platform': '"macOS"',
//             'origin': 'https://www.disneyplus.com',
//             'sec-fetch-site': 'cross-site',
//             'sec-fetch-mode': 'cors',
//             'sec-fetch-dest': 'empty',
//             'referer': 'https://www.disneyplus.com/',
//             'accept-language': 'en-CA,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
//
//         },
//         url: 'https://disney.content.edge.bamgrid.com/svc/search/disney/version/5.1/region/CA/audience/k-false,l-false/maturity/1830/language/en/queryType/ge/pageSize/30/query/' + encodeURIComponent(searchTerm)
//     }
//     return axios(config);
// }
//
// async function updateToken() {
//     const webdriver = require('selenium-webdriver'),
//         By = webdriver.By;
//     const driver = new webdriver.Builder()
//         .forBrowser('chrome')
//         .build();
//
//     let loggedIn = new Promise((resolve) => {
//         driver.get("https://www.disneyplus.com/login");
//
//         driver.wait(webdriver.until.elementLocated(By.id("email")), 100 * 1000)
//             .then(() => {
//                 driver.findElement(By.id("email")).sendKeys(vars['disney']['email'], webdriver.Key.ENTER);
//             });
//
//         driver.wait(webdriver.until.elementLocated(By.id("password")), 100 * 1000)
//             .then(() => {
//                 driver.findElement(By.id("password")).sendKeys(vars['disney']['password'], webdriver.Key.ENTER).then(() => {
//                     resolve("return localStorage.getItem('__bam_sdk_access--disney-svod-3d9324fc_prod')");
//                 });
//             });
//     });
//
//     const script = await loggedIn;
//     const result = await driver.executeScript(script);
//
//     vars['disney']['token'] = JSON.parse(result)['context']['token']
//     fs.writeFile('./vars.json', JSON.stringify(vars), function (err) {
//         if (err) throw err;
//         console.log('Token Updated');
//         try {
//             driver.close();
//         } catch (e) {
//             console.log('crashed the browser, i guess this works')
//         }
//     });
//
//     return JSON.parse(result)['context']['token']
// }

