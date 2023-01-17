export default {
  // The url of the CSS file used to refer to the unicode-range configuration
  // 用于参考unicode-range配置的CSS文件的url
  templateURL: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC',

  // Alternate url in case the above url is not accessible
  // 备用的url，以防上面的url无法访问
  alternativeTemplateURL: 'https://fonts.loli.net/css2?family=Noto+Sans+SC',

  // Source font file name (need to be placed in the src folder)
  // 源字体文件名（需放置在src文件夹下）
  sourceFontFileName: 'sarasa-mono-sc-regular.ttf',

  // Specify the filename of the generated font subset
  // 指定生成的字体子集的文件名
  outputFontFileName: 'sarasa-mono-sc-regular',
  
  // The content of @font-face in the generated CSS file
  // 生成的CSS文件中的@font-face的内容
  fontFamily: 'Sarasa Mono SC',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontDisplay: 'swap',
}