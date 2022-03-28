const palette = require('image-palette');
const pixels = require('image-pixels');
const { prompt } = require('enquirer');
const fs = require('fs');



async function main() {
    const quantity = await prompt([{ type: 'select', 'name': 'file', message:'Input File?', choices: getAvailableFiles()}, { type: 'numeral', name: 'sets', message:'How many sets?', validate: notZero}, { type: 'numeral', name: 'colors', message:'How many colors per set?', validate: notZero}, { type: 'numeral', name: 'delay', message:'Delay between color fades? (ms)', validate: notZero}]);
    let {ids, colors} = palette(await pixels('./' + quantity.file), quantity.sets * quantity.colors);
    colors = colors.map(x => [x[0], x[1], x[2]]);
    let newColors = [];
    for (let i = 0; i < quantity.sets; i++) {
        newColors.push(colors.splice(0, quantity.colors));
    }
    colors = newColors;
    // console.log(colors);
    for (let i = 0; i < colors.length; i++) {
        const colorSet = colors[i];
        const code = generateCode(colorSet, quantity.delay);
        fs.writeFileSync('./' + i + '.txt', code);
    }
    console.log('Wrote code successfully!');
}

function generateCode(colorSet, delay) {
    let code = '';
    for (let i = 0; i < colorSet.length; i++) {
        const color = colorSet[i];
        code += `fadeColor(${color[0]}, ${color[1]}, ${color[2]});\n`;
        code += `delay(${delay});\n`;
    }
    return code;
}

function notZero(x) {
    return x == 0 ? "Cannot be zero": true;
}

function getAvailableFiles() {
    let files = fs.readdirSync('.');
    files = files.filter(x => x.endsWith('.jpg') || x.endsWith('.png'));
    return files;
}

main();
