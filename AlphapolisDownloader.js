// ==UserScript==
// @name         AlphapolisDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.6
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for www.alphapolis.co.jp
// @icon         https://www.alphapolis.co.jp/favicon.ico
// @homepageURL  https://greasyfork.org/zh-CN/scripts/451858-alphapolisdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://www.alphapolis.co.jp/manga/official/*/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get title
  const title = document.querySelector('title').textContent;

  // get image urls from document
  const urls = await axios
    .get(window.location.href)
    .then(res => res.data.match(/https:\\\/\\\/cdn-image\.alphapolis\.co\.jp\\\/official_manga\\\/page\\\/\d+\\\/\d+\\\/[a-z0-9-]+\\\/\d+x\d+\.jpg/g))
    .then(urls => urls.map(url => url.replaceAll('\\', '').replace(/\d+x\d+\.jpg/, '1080x1536.jpg')));

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: urls.length,
    getImagePromises,
    title
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return urls
      .slice(startNum - 1, endNum)
      .map(url => getImage(url)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of image
  function getImage(url) {
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'arraybuffer',
        onload: res => resolve(res.response)
      });
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);
