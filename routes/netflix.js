const express = require('express');
const router = express.Router();
const axios = require('axios').default;
const fs = require('fs')

const netflixCookies = {
    'memclid': 'b9363162-e689-426d-ba87-569c3d1b0176',
    'clSharedContext': '5c4fd9fb-4e8f-471e-bd1a-728790e67664',
    'hasSeenCookieDisclosure': 'true',
    'dsca': 'anonymous',
    'nfvdid': 'BQFmAAEBEFOoUp8XD_wUxkcBUVDnDZRgII5DdiuXFI0fflFJKBORmxDiS3A1CNVpxaSA61LxjtangOnT8XUJ22DHKGaal8WOV0b2do9nzF4MPBxACdckNiK_CgNqBssScQQDHSG7TB6KN_H4kutvCvYKzmQNEaeo',
    'cL': '1639482894394%7C163948289110876575%7C163948289198479275%7C%7C4%7Cnull',
    'profilesNewSession': '0',
    'OptanonConsent': 'isIABGlobal=false&datestamp=Fri+Dec+17+2021+18%3A54%3A22+GMT-0800+(Pacific+Standard+Time)&version=6.6.0&consentId=a4474796-d650-4a2e-ad1d-b136092790a2&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0004%3A1&hosts=H12%3A1%2CH13%3A1%2CH27%3A1%2CH28%3A1%2CH30%3A1&AwaitingReconsent=false',
    'SecureNetflixId': 'v%3D2%26mac%3DAQEAEQABABQwQVfdRZbb5kIJuXAdZUo0InJBg-78n88.%26dt%3D1639796063279',
    'NetflixId': 'v%3D2%26ct%3DBQAOAAEBEPvzLRBUh8JUEVZw62cJXxaBwIFd5tX5Oo-YeAmDKVVTF4YwwXQtWjAObvDLMxcSvRlTNQX9WiH7Ps3XwrVPNjGXgKCX01517BTcAb_6ktS3VDnar8216bViX-LDW3quVgwBkKo3toPg6ATEEJIDqOI0Ps1kiRhXPM7f4lynwlZHAKsQV6NMwTCCQ831hsK8SCLTQ0wK-BtWPDNpT-iT6FU5A6zVpxYjoPdfm0ajUeznm59LRrNUG__vyWMb6WS-XICYfwGMzUYaINIIrzWsHLUm1OjbUi0SPixb1sHq0wmMfmAxGCrol9A5Io1m1M0E_Rh7DY3zgzZbSbsny_pvdxViqZGBBvLDw6gLpjvAyXWQL6rSOiqIqNpLbCw7tsJRWRhjrAJHRyKAUrO140P-AvefM-CEUCNdVaM3IyHncYjOz9MVBsiPOMrnbGUhoizkULkCnyYblAbfu6echDAuOvR9wxS6Ok6jRhhgvwnMO3qvyQwaxdZ7bnk-GLv2ug0wulGTWZcA8upKoWUJd1b1G1suWsE7a3Lhqx9V6uJShsuhiA8yspk7YkrqjS2vrb2JSrPgZUioKhFlkgD9sJpfoKq-aDoqbrnM7zu2zO7DyvjxBLI.%26bt%3Ddbl%26ch%3DAQEAEAABABQ1L3_B1NtHpUPaadggMW0kJ18-5Subdbg.%26mac%3DAQEAEAABABRZWHBkv4ELcmO2UcmYcc87Iq6-G9E2g5g.',
    'playerPerfMetrics': '%7B%22uiValue%22%3A%7B%22throughput%22%3A1419.95%2C%22throughputNiqr%22%3A0.4077058933871714%7D%2C%22mostRecentValue%22%3A%7B%22throughput%22%3A1518.58%2C%22throughputNiqr%22%3A0.4077058933871714%7D%7D',
}


router.get('/random/:seriesId', function (req, res, next) {
    getRandom(req.params['seriesId']).then(episode => {
        axios.post('http://' + vars()['roku']['ip'] + ':8060' + '/launch/291097?MediaType=movie&ContentID=' + episode['contentId'])
            .then(() => {
                res.send('done')
            }).catch(function (error) {
            console.log(error)
            res.send(error);
        });
    });
});

router.get('/', function (req, res, next) {
    getEpisodes('70155589');
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
    let netflixCookies = {
        'memclid': 'b9363162-e689-426d-ba87-569c3d1b0176',
        'clSharedContext': '5c4fd9fb-4e8f-471e-bd1a-728790e67664',
        'hasSeenCookieDisclosure': 'true',
        'dsca': 'anonymous',
        'nfvdid': 'BQFmAAEBEFOoUp8XD_wUxkcBUVDnDZRgII5DdiuXFI0fflFJKBORmxDiS3A1CNVpxaSA61LxjtangOnT8XUJ22DHKGaal8WOV0b2do9nzF4MPBxACdckNiK_CgNqBssScQQDHSG7TB6KN_H4kutvCvYKzmQNEaeo',
        'cL': '1639482894394%7C163948289110876575%7C163948289198479275%7C%7C4%7Cnull',
        'profilesNewSession': '0',
        'OptanonConsent': 'isIABGlobal=false&datestamp=Fri+Dec+17+2021+18%3A54%3A22+GMT-0800+(Pacific+Standard+Time)&version=6.6.0&consentId=a4474796-d650-4a2e-ad1d-b136092790a2&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0004%3A1&hosts=H12%3A1%2CH13%3A1%2CH27%3A1%2CH28%3A1%2CH30%3A1&AwaitingReconsent=false',
        'SecureNetflixId': 'v%3D2%26mac%3DAQEAEQABABQwQVfdRZbb5kIJuXAdZUo0InJBg-78n88.%26dt%3D1639796063279',
        'NetflixId': 'v%3D2%26ct%3DBQAOAAEBEPvzLRBUh8JUEVZw62cJXxaBwIFd5tX5Oo-YeAmDKVVTF4YwwXQtWjAObvDLMxcSvRlTNQX9WiH7Ps3XwrVPNjGXgKCX01517BTcAb_6ktS3VDnar8216bViX-LDW3quVgwBkKo3toPg6ATEEJIDqOI0Ps1kiRhXPM7f4lynwlZHAKsQV6NMwTCCQ831hsK8SCLTQ0wK-BtWPDNpT-iT6FU5A6zVpxYjoPdfm0ajUeznm59LRrNUG__vyWMb6WS-XICYfwGMzUYaINIIrzWsHLUm1OjbUi0SPixb1sHq0wmMfmAxGCrol9A5Io1m1M0E_Rh7DY3zgzZbSbsny_pvdxViqZGBBvLDw6gLpjvAyXWQL6rSOiqIqNpLbCw7tsJRWRhjrAJHRyKAUrO140P-AvefM-CEUCNdVaM3IyHncYjOz9MVBsiPOMrnbGUhoizkULkCnyYblAbfu6echDAuOvR9wxS6Ok6jRhhgvwnMO3qvyQwaxdZ7bnk-GLv2ug0wulGTWZcA8upKoWUJd1b1G1suWsE7a3Lhqx9V6uJShsuhiA8yspk7YkrqjS2vrb2JSrPgZUioKhFlkgD9sJpfoKq-aDoqbrnM7zu2zO7DyvjxBLI.%26bt%3Ddbl%26ch%3DAQEAEAABABQ1L3_B1NtHpUPaadggMW0kJ18-5Subdbg.%26mac%3DAQEAEAABABRZWHBkv4ELcmO2UcmYcc87Iq6-G9E2g5g.',
        'playerPerfMetrics': '%7B%22uiValue%22%3A%7B%22throughput%22%3A1419.95%2C%22throughputNiqr%22%3A0.4077058933871714%7D%2C%22mostRecentValue%22%3A%7B%22throughput%22%3A1518.58%2C%22throughputNiqr%22%3A0.4077058933871714%7D%7D',
    }

    let headers = {
        'referer': 'https://www.netflix.com/title/' + seriesId,
    }

    let params = {
        'original_path': '/shakti/v02d67cac/pathEvaluator',
    }

    let data = {
        'path': '["videos",' + seriesId + ',"seasonList",[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],"summary"]',
        'authURL': '1639514818659.b8AXUKgiPl/OSpK0lY6FovdQjME=',
    }

    let config = {
        'body':data,
        'params':params,
        'headers':headers,
        'cookies':netflixCookies,
    }

    let seriesData = await axios.post('https://www.netflix.com/nq/website/memberapi/v02d67cac/pathEvaluator',config)

    console.log(seriesData.data)
}

//
// let data = [];
// //let seriesData = await axios.get('https://disney.content.edge.bamgrid.com/svc/content/DmcSeriesBundle/version/5.1/region/CA/audience/false/maturity/1830/language/en/encodedSeriesId/' + seriesId);
// let seasons = seriesData.data['data']['DmcSeriesBundle']['seasons']['seasons']
// for (const season of seasons) {
//     let episodesData = await axios.get('https://disney.content.edge.bamgrid.com/svc/content/DmcEpisodes/version/5.1/region/CA/audience/false/maturity/1830/language/en/seasonId/' + season['seasonId'] + '/pageSize/30/page/1');
//     let episodes = episodesData.data['data']['DmcEpisodes']['videos'];
//     episodes.forEach(episode => {
//         data.push({
//             'season': episode['seasonSequenceNumber'],
//             'episode': episode['episodeSequenceNumber'],
//             'title': episode['text']['title']['full']['program']['default']['content'],
//             'contentId': episode['contentId']
//         })
//     });
// }
// return data
// }

function vars() {
    return JSON.parse(fs.readFileSync('./vars.json'))
}

module.exports = router;