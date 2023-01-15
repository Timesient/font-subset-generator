import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Font } from 'fonteditor-core';
import ttf2woff2 from 'ttf2woff2';
import axios from 'axios';
import config from './config.js';

// build paths
const __dirname = dirname(fileURLToPath(import.meta.url));
const srcFolderPath = join(__dirname, 'src');
const distFolderPath = join(__dirname, 'dist');
const outputFolderPath = join(distFolderPath, config.outputFontFileName);

/**
 * @description get CSS from google fonts
 * @param {string} url the url of CSS file
 * @returns {Promise<string>} a promise of CSS content
 */
async function getCSS(url) {
  return await axios({
    method: 'GET',
    url,
    responseType: 'text',
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    }
  }).then(res => res.data);
}

/**
 * @description extract hexadecimal ranges from CSS content
 * @param {string} cssContent CSS content
 * @returns {Array<Array<string>>} a array contains arrays of hexadecimal ranges
 */
function getHexadecimalRanges(cssContent) {
  return cssContent
    // get array of 'unicode-range'
    .match(/unicode-range:(.*);/gm)
    .map(range => range
      // clear 'unicode-range:'
      .replace('unicode-range:', '')
      // clear ';'
      .replace(';', '')
      // clear whitespace
      .replaceAll(/\s/g, '')
      // split the string into array
      .split(',')
    );
}

/**
 * @description parse hexadecimal ranges to decimal integers
 * @param {Array<Array<string>>} hexadecimalRanges a array contains arrays of hexadecimal ranges
 * @returns {Array<Array<number>>} a array contains arrays of decimal integers
 */
function getDecimalRanges(hexadecimalRanges) {
  return hexadecimalRanges.map(ranges => {
    let result = [];
    for (let range of ranges) {
      range = range.replace('U+', '');
      if (range.includes('-')) {
        const [fromHex, toHex] = range.split('-');
        const fromInt = Number.parseInt(fromHex, 16);
        const toInt = Number.parseInt(toHex, 16);
        for (let i = fromInt; i <= toInt; i++) {
          result.push(i);
        }
      } else {
        result.push(Number.parseInt(range, 16));
      }
    }

    return result;
  });
}

async function main() {
  // get CSS from google fonts 
  const cssContent = await Promise.any([
    getCSS(config.templateURL),
    getCSS(config.alternativeTemplateURL)
  ]);

  // get hexadecimal ranges 
  const hexadecimalRanges = getHexadecimalRanges(cssContent);

  // get decimal ranges
  const decimalRanges = getDecimalRanges(hexadecimalRanges);

  // create dist folder & output folder
  await fs.promises.mkdir(distFolderPath).catch(_ => void 'dist folder already exists');
  await fs.promises.mkdir(outputFolderPath).catch(_ => void 'output folder already exists');

  // get and check type of font file
  const fontType = config.sourceFontFileName.slice(config.sourceFontFileName.lastIndexOf('.') + 1);
  if (!/^(ttf|woff|woff2|eot|otf|svg)$/.test(fontType)) throw new Error(`Type '${fontType}' is not supported.`);

  // get buffer of font file
  const fontBuffer = await fs.promises.readFile(join(srcFolderPath, config.sourceFontFileName));

  // start creating subsets and their referring CSS file
  let referringCSSContent = '';
  for (let index = 0; index < decimalRanges.length; index++) {
    // get subset data according to range
    const subsetData = Font.create(fontBuffer, {
      type: fontType,
      subset: decimalRanges[index],
      hinting: true,
      compound2simple: true,
    });

    // create ttf buffer of subset Data
    const ttfBuffer = subsetData.write({
      type: 'ttf',
      hinting: true,
    });

    const subsetFilename = `${config.outputFontFileName}.subset.${index + 1}.woff2`;

    // write subset file
    await fs.promises.writeFile(join(outputFolderPath, subsetFilename), ttf2woff2(ttfBuffer));

    // append CSS content
    referringCSSContent += `@font-face {\n  font-family: '${config.fontFamily}';\n  font-style: '${config.fontStyle}';\n  font-weight: '${config.fontWeight}';\n  font-display: '${config.fontDisplay}';\n  src: url('./${subsetFilename}') format('woff2');\n  unicode-range: ${hexadecimalRanges[index].join(', ')};\n}\n\n`;

    // print progress on console
    console.log(`Progress: ${subsetFilename} created [${index + 1} of ${decimalRanges.length}]`);
  }

  // write referring CSS file
  await fs.promises.writeFile(join(outputFolderPath, `${config.outputFontFileName}.css`), referringCSSContent, 'utf-8');
}

main()
  .then(_ => console.log("Completed. Please check the 'dist' folder."))
  .catch(err => console.log(err));