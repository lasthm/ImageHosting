// ==UserScript==
// @name         ComicDaysDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.5
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for comic-days.com and other sites using the same reader
// @icon         https://comic-days.com/images/favicon.ico
// @homepageURL  https://greasyfork.org/zh-CN/scripts/451861-comicdaysdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://comic-days.com/*/*
// @match        https://shonenjumpplus.com/*/*
// @match        https://kuragebunch.com/*/*
// @match        https://www.sunday-webry.com/*/*
// @match        https://comicbushi-web.com/*/*
// @match        https://tonarinoyj.jp/*/*
// @match        https://comic-gardo.com/*/*
// @match        https://pocket.shonenmagazine.com/*/*
// @match        https://comic-zenon.com/*/*
// @match        https://comic-trail.com/*/*
// @match        https://comic-action.com/*/*
// @match        https://magcomi.com/*/*
// @match        https://viewer.heros-web.com/*/*
// @match        https://feelweb.jp/*/*
// @match        https://comicborder.com/*/*
// @match        https://comic-ogyaaa.com/*/*
// @match        https://www.corocoro.jp/*/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// ==/UserScript==

(async function (axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = new RegExp(`${window.location.origin}/.*/.*`);
  const oldHref = window.location.href;
  const timer = setInterval(() => {
    const newHref = window.location.href;
    if (newHref === oldHref) return;
    if (re.test(newHref) || re.test(oldHref)) {
      clearInterval(timer);
      window.location.reload();
    }
  }, 200);

  // return if not reading chapter now
  if (!re.test(oldHref)) return;

  // get JSON data of episode
  const jsonData = await new Promise(resolve => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: window.location.origin + window.location.pathname + '.json',
      responseType: 'json',
      headers: { 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1' },
      onload: res => resolve(res.response)
    });
  });

  // get url of images and title
  const imageURLs = jsonData.readableProduct.pageStructure.pages.filter(item => item.src).map(item => item.src);
  const title2 = jsonData.readableProduct.title;
  const title1 = document.querySelector('h1.series-header-title').textContent;

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: imageURLs.length,
    getImagePromises,
    title: `${title1} ${title2}`,
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
