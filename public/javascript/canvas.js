let theme = 'lesser-dark'

for (let r = 0; r < 8; r++) {
    $('#grid').append('<div id="r' + r + '" class="row"></div>');
    for (let c = 0; c < 3; c++) {
        $('#r' + r).append('<div class="gridButton" onclick="loadConfig(' + (r * 3 + c) + ')"></div>');
    }
}


save = function () {
    $.post("/inky/canvas", {
        canvas: JSON.stringify(canvas.toJSON()),
        config: JSON.stringify(configData),
        image: canvas.toDataURL({multiplier: 0.5})
    });
    $('#save').text('SAVED')
}


let code = [];
loadEditor = function (button = null) {
    $('.code').each(function (i, editor) {
        code[editor.id] = CodeMirror.fromTextArea(editor, {
            mode: {
                name: "python",
                version: 3,
                singleLineStringErrors: false
            },
            lineNumbers: true,
            indentUnit: 4,
            matchBrackets: true,
            theme: theme,
        })
        code[editor.id].setSize("100%", 120);
        code[editor.id].on('focus', function () {
            canvas.discardActiveObject().renderAll();
        });
        code[editor.id].on("change", () => {
            $('#save').text('SAVE')
            if (button != null) {
                configData['buttons'][button][editor.id] = code[editor.id].getValue();
            } else {
                configData[editor.id] = code[editor.id].getValue();
            }
        });
    });
}


loadConfig = function (button) {
    $('#content').empty().append(
        '            <h1>BUTTON ' + button + '</h1>\n' +
        '            <hr class="white">\n' +
        '            <label for="released" class="white">RELEASED</label>\n' +
        '            <textarea class="code" id="released" style="height: 10px">' + configData['buttons'][button]['released'] + '</textarea>\n' +
        '            <hr class="white">\n' +
        '            <label for="held" class="white">HELD</label>\n' +
        '            <textarea class="code" id="held" style="height: 10px">' + configData['buttons'][button]['held'] + '</textarea>\n' +
        '            <hr class="white">\n' +
        '            <label for="misc" class="white">MISC</label>\n' +
        '            <textarea class="code" id="misc" style="height: 10px">' + configData['buttons'][button]['misc'] + '</textarea>');
    loadEditor(button);
}

loadGlobals = function () {
    $('#content').empty().append(
        '            <h1>GLOBALS</h1>\n' +
        '            <hr class="white">\n' +
        '            <label id="varsLabel" for="vars" class="white">VARS</label>\n' +
        '            <textarea id="vars" style="height: 10px">' + JSON.stringify(configData['vars'], null, 2) + '</textarea>\n' +
        '            <hr class="white">\n' +
        '            <label for="setup" class="white">SETUP</label>\n' +
        '            <textarea class="code" id="setup" style="height: 10px">' + configData['setup'] + '</textarea>\n' +
        '            <hr class="white">\n' +
        '            <label for="misc" class="white">MISC</label>\n' +
        '            <textarea class="code" id="misc" style="height: 10px">' + configData['misc'] + '</textarea>');
    loadEditor();
    code['vars'] = CodeMirror.fromTextArea(document.getElementById('vars'), {
        mode: {
            name: "javascript",
            json: true,
        },
        lineNumbers: true,
        indentUnit: 4,
        matchBrackets: true,
        theme: theme,
    })
    code['vars'].setSize("100%", 120);
    code['vars'].on('focus', function () {
        canvas.discardActiveObject().renderAll();
    });
    code['vars'].on("change", () => {
        $('#save').text('SAVE')
        try {
            configData['vars'] = JSON.parse(code['vars'].getValue());
            $('#varsLabel').text('VARS').attr('style', 'color: white !important');
        } catch (e) {
            $('#varsLabel').text('VARS - INVALID JSON').attr('style', 'color: red !important');
        }
    });
    return arguments.callee;
}();


let newCanvas = (function () {
    canvas = new fabric.Canvas('canvas', {
        width: 256,
        height: 592,
        backgroundColor: "#000000"
    });
    return arguments.callee;
})();

loadCanvas = (function () {
    canvas.loadFromJSON(canvasData, canvas.renderAll.bind(canvas));
    return arguments.callee;
})();

canvas.on('object:moving', function (options) {
    $('#save').text('SAVE')
    options.target.set({
        left: Math.round(options.target.left / (canvas.width / 6)) * (canvas.width / 6) - options.target.width / 2,
        top: Math.round(options.target.top / (canvas.height / 16)) * (canvas.height / 16) - options.target.height / 2
    });
});

pasteImage = function (e) {
    var items = e.originalEvent.clipboardData.items;
    e.preventDefault();
    e.stopPropagation();
    for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') == -1) continue;
        var form = new FormData();
        form.append('image', items[i].getAsFile());
        axios({
            method: "post",
            url: "/inky/canvas/image",
            data: form,
            headers: {"Content-Type": "multipart/form-data"},
        })
            .then(function (response) {
                console.log(response['data']);
                fabric.Image.fromURL(response['data'], function (img) {
                    canvas.add(img);
                });
            })
            .catch(function (response) {
                alert('no worky');
                console.log(response);
            });
    }
};
$(window).on('paste', pasteImage);

//
// drawGrid = function (e) {
//     for (var i = 0; i < canvas.width; i += (canvas.width / 3))
//         canvas.add(new fabric.Line([i, 0, i, canvas.height], {
//             stroke: '#FFFFFF',
//             strokeWidth: .1,
//             selectable: false
//         }));
//     for (var i = 0; i < canvas.height; i += (canvas.height / 8))
//         canvas.add(new fabric.Line([0, i, canvas.height, i], {
//             stroke: '#FFFFFF',
//             strokeWidth: .1,
//             selectable: false
//         }));
// };