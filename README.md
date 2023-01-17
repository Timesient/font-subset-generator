# Font Subset Generator
一个用于对字体（主要针对CJK字体）进行子集化的工具。

## What for?
当在Web环境下需要加载整套CJK字体时，通常会遇到由于字体文件的体积过大，导致字体加载时间过长，字体闪烁现象明显的问题。对于这个问题其中一个有效的解决方式就是 Google Fonts 团队使用到的对字体文件进行切分，再利用 `@font-face` 中的 `unicode-range` 属性，让浏览器自动根据出现的字形加载字体子集的方案，以此大幅提高字体的加载速度。

本项目就是这么一个利用 Google Fonts 的字形切分方案，对 `ttf|woff|woff2|eot|otf|svg` 格式的字体进行子集化并将字体子集统一转换为 `woff2` 格式的工具。

## Usage
1. `git clone https://github.com/Timesient/font-subset-generator.git`
2. `cd font-subset-generator`
3. `npm install`
4. 将需要子集化的字体文件放到 `src` 文件夹中
5. 按需修改 `config.js` 中的配置
6. `npm start`
7. 运行结束后进入 `dist` 文件夹的查看结果

## Reference
- [Google Fonts](https://fonts.google.com/)
- [fonteditor-core](https://github.com/kekee000/fonteditor-core)
- [ttf2woff2](https://github.com/nfroidure/ttf2woff2)
- [Sarasa-Gothic](https://github.com/be5invis/Sarasa-Gothic)
- [misans](https://github.com/dsrkafuu/misans)

## License
[GPL-3.0](https://github.com/Timesient/font-subset-generator/blob/main/LICENSE)