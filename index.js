const palette = require('image-palette');
const pixels = require('image-pixels');
const { prompt } = require('enquirer');
const fs = require('fs');
const gradient = require('gradient-string');
const chalk = require('chalk');


const str = '■'.repeat(48);

async function main() {
    const quantity = await prompt([{ type: 'select', 'name': 'file', message:'Input File?', choices: getAvailableFiles()}, { type: 'numeral', name: 'sets', message:'How many sets?', validate: notZero}, { type: 'numeral', name: 'colors', message:'How many colors per set?', validate: notZero}, { type: 'numeral', name: 'delay', message:'Delay between color fades? (ms)', validate: notZero}, { type: 'select', 'name': 'mode', message:'Which mode to run?', choices: ['Automatic', 'Manual']}]);
    console.log('Generating colors, please wait...');
    let {ids, colors} = palette(await pixels('./' + quantity.file), quantity.sets * quantity.colors);
    colors = colors.map(x => [x[0], x[1], x[2]]);
    console.log('Done!');
    if(quantity.mode === 'Automatic') {
        autoMode(quantity, colors);
    } else if (quantity.mode === 'Manual') {
        manualMode(quantity, colors);
    }
}

async function manualMode(quantity, colors) {
    console.log('System will select colors, you can select gradients');
    const colorMap = {};
    for (let i = 0; i < colors.length; i++) {
        colorMap[i] = colors[i];
    }
    colorSets = [];
    for (let i = 0; i < quantity.sets; i++) {
        let colorSet = await prompt({type: 'multiselect', name: 'name', message: 'Colors to include in fade ' + i,  choices: colors.map(x => ({ name: x.toString() + chalk.rgb(x[0], x[1], x[2])(' ■'), value: x})), result(names) { return this.map(names) }});
        colorSet = Object.values(colorSet.name);
        let tmp = await prompt({ type: 'sort', name:'name', message: 'Sort the colors in your preference', numbered: true, hint: 'Use <shift>+<up>/<down> to sort', choices: colorSet.map(x => ({ name: x.toString() + chalk.rgb(x[0], x[1], x[2])(' ■'), value: x})), result(names) { return this.map(names) }})
        colorSet = Object.values(tmp.name);
        colorSets.push(colorSet);
    }
    printGradients(colorSets);
    writeColors(colorSets, quantity.delay);
}

async function autoMode(quantity, colors) {
    console.log('Automatic mode, system will generate gradients automatically, don\'t expect them to be too good.')
    let colorSets = [];
    for (let i = 0; i < quantity.sets; i++) {
        colorSets.push(colors.splice(0, quantity.colors));
    }
    printGradients(colorSets);
    writeColors(colorSets, quantity.delay);
}

function printGradients(colorSets) {
    console.log("Generated gradients:\n");
    for (let i = 0; i < colorSets.length; i++) {
        const colorSet = colorSets[i];
        const gradientColors = [];
        for(let x = 0; x < colorSet.length; x++) {
            color = colorSet[x];
            gradientColors.push('#' + rgbToHex(color[0], color[1], color[2]))
        }
        console.log(i + '.txt: ' + gradient(gradientColors)(str));
    }
}

function writeColors(colorSets, delay) {
    for (let i = 0; i < colorSets.length; i++) {
        const colorSet = colorSets[i];
        const code = generateCode(colorSet, delay);
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

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

main();
