const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
let jsonFile = require('jsonfile');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    }
})
const upload = multer({storage: storage})


router.get('/', (req, res) => {
    let profiles = fs.readFileSync('./profiles/profiles.json')
    let profile = fs.readFileSync('./profiles/' + JSON.parse(profiles)['selected'] + '.json')
    res.render('canvas', {
        profileName: profiles,
        configData: profile
    })
});

router.get('/battery', upload.single('image'), (req, res) => {
    let battery = jsonFile.readFileSync('./battery.json')
    res.send(battery[battery.length - 1])
});

router.post('/battery/:percentage', upload.single('image'), (req, res) => {
    let battery = jsonFile.readFileSync('./battery.json')
    battery.push({
        percentage: req.params['percentage'],
        time: Date.now()
    });
    jsonFile.writeFileSync('./battery.json', battery)
    res.end()
});

router.get('/get', (req, res) => {
    let profiles = fs.readFileSync('./profiles/profiles.json')
    let profile = fs.readFileSync('./profiles/' + JSON.parse(profiles)['selected'] + '.json')
    res.send(profile)
});

router.post('/image', upload.single('image'), (req, res) => {
    console.log(req.file)
    fs.rename(req.file['path'], 'public/images/' + req.file['originalname'], function (err) {
        if (err) console.log('ERROR: ' + err);
    });
    res.send('/images/' + req.file['originalname'])
});

router.get('/:profile', (req, res) => {
    try {
        let profiles = JSON.parse(fs.readFileSync('./profiles/profiles.json'))
        let profile = fs.readFileSync('./profiles/' + req.params['profile'] + '.json')
        profiles['selected'] = req.params['profile'];
        res.render('canvas', {
            profileName: JSON.stringify(profiles),
            configData: profile
        })
    } catch (e) {
        console.log(e);
        res.redirect('/inky')
    }
});

router.post('/:profile', (req, res) => {
    console.log(req.params['profile']);
    try {
        let profiles = jsonFile.readFileSync('./profiles/profiles.json')
        profiles['selected'] = req.params['profile'].replaceAll(' ', '_');
        if (profiles['profiles'].indexOf(profiles['selected']) === -1) {
            profiles['profiles'].push(profiles['selected']);
        }
        console.log(profiles)
        jsonFile.writeFileSync('./profiles/profiles.json', profiles)
        jsonFile.writeFileSync('./profiles/' + profiles['selected'] + '.json', JSON.parse(req.body['profile']));
    } catch (e) {
        console.log(e)
        res.send(e);
    }
});


module.exports = router;

