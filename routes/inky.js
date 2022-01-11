const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
let jsonFile = require('jsonfile');
const Jimp = require("jimp")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    }
})
const upload = multer({storage: storage})


// router.get('/config', (req, res) => {
//     res.render('config')
// });
//
//
// router.get('/config/:button', (req, res) => {
//     res.render('configButtons', {button: req.params['button']})
// });
//
//
// router.post('/config/:button', upload.single('image'), (req, res) => {
//     console.log(req)
//     fs.rename(req.file['path'], 'public/images/' + req.params['button'] + '.png', function (err) {
//         if (err) console.log('ERROR: ' + err);
//     });
//     //console.log(req.body['test'])
//     res.redirect('/inky/config')
// });


router.get('/canvas', (req, res) => {
    res.render('canvas', {
        canvasData: fs.readFileSync('public/canvas.json'),
        configData: fs.readFileSync('public/config.json')
    })
});

router.post('/canvas', (req, res) => {
    try {
        jsonFile.writeFileSync('public/canvas.json', JSON.parse(req.body['canvas']));
        jsonFile.writeFileSync('public/config.json', JSON.parse(req.body['config']));
        Jimp.read(Buffer.from(req.body['image'],'base64'), function (err, image) {
            if (err) {
                console.log(err)
            } else {
                image.write("new-image.bmp")
            }
        })
    } catch (e) {
        console.log(e)
        res.send(e);
    }
});

router.post('/canvas/image', upload.single('image'), (req, res) => {
    console.log(req.file)
    fs.rename(req.file['path'], 'public/images/' + req.file['originalname'], function (err) {
        if (err) console.log('ERROR: ' + err);
    });
    res.send('/images/' + req.file['originalname'])
});

module.exports = router;

