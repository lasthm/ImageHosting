// ==UserScript==
// @name         MangaboxDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for www.mangabox.me
// @icon         https://image-a.mangabox.me/static/assets/favicon.ico
// @homepageURL  https://greasyfork.org/zh-CN/scripts/455860-mangaboxdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://www.mangabox.me/reader/*/episodes/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get url of images
  const imageURLs = await new Promise(resolve => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: window.location.href,
      responseType: 'text',
      headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36' },
      onload: res => {
        const html = res.response;
        const urls = html.match(/https:\/\/image-a.mangabox.me\/static\/content\/reader\/\d+\/[a-z0-9]{64}\/sp\/\d+\.(jpg|png)\?t=\d{10}/g);
        resolve(urls);
      }
    });
  });

  // get title
  const title1 = document.querySelector('span.episode_header_title a').textContent;
  const title2 = document.querySelector('span.episode_header_volume').textContent.trim();

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
      .map(url => axios
        .get(url, { responseType: 'arraybuffer' })
        .then(res => res.data)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }
  
})(axios, JSZip, saveAs, ImageDownloader);
