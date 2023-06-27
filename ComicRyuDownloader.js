// ==UserScript==
// @name         ComicRyuDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for comic-ryu.jp
// @icon         https://comic-ryu.jp/img/icon.png
// @homepageURL  https://greasyfork.org/zh-CN/scripts/455399-comicryudownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://comic-ryu.jp/*/comic/*.html
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_info
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get comic ID and episode ID
  const { comicID, episodeID } = window.location.href.match(/comic-ryu.jp\/(?<comicID>.*)\/comic\/(?<episodeID>.*)\.html/).groups;

  // redirect if episode ID not starts with 'sp'
  if (!episodeID.startsWith('sp')) window.location.href = `https://comic-ryu.jp/${comicID}/comic/sp${episodeID}.html`;

  // get url of images
  const html = await axios.get(window.location.href).then(res => res.data);
  const pageAmount = html.match(/var (pageNumber|page) = (?<amount>\d+);/).groups.amount;
  const imageURLs = Array.from({ length: pageAmount }, (_, index) => `https://comic-ryu.jp/${comicID}/comic/comic/${episodeID}/${String(index + 1).padStart(2, '0')}.jpg`);

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: imageURLs.length,
    getImagePromises,
    title: `${document.title.split('｜')[0]} 第${episodeID.replace('sp', '')}話`
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return imageURLs
      .slice(startNum - 1, endNum)
      .map(url => axios.get(url, { responseType: 'arraybuffer' })
        .then(res => res.data)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

})(axios, JSZip, saveAs, ImageDownloader);
