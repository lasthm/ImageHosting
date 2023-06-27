// ==UserScript==
// @name         YomongaDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for www.yomonga.com
// @icon         https://www.yomonga.com/images/favicon.ico
// @homepageURL  https://greasyfork.org/zh-CN/scripts/451886-yomongadownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://www.yomonga.com/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_info
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = /https:\/\/www\.yomonga\.com\/chapter\/.*/;
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

  // get chapter id
  const chapterId = window.location.pathname.match(/chapter\/(?<id>\d+)/).groups.id;

  // get title
  const title = document.querySelector('div.header-module-header-13QhGiw6a6Qivp78FA543n h1').textContent;

  // get encrypted image data
  const url = `https://www.yomonga.com/api/chapter?id=${chapterId}`;
  const configData = await axios.get(url).then(res => res.data);
  const regexp = /(https:\/\/www\.yomonga.*manga_page.*duration=\d+).*([0-9a-z]{128})/gm;
  const encryptedImageData = Array.from(configData.matchAll(regexp)).map(item => ({ url: item[1], key: item[2] }));

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: encryptedImageData.length,
    getImagePromises,
    title,
    imageSuffix: 'png'
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return encryptedImageData
      .slice(startNum - 1, endNum)
      .map(data => getDecryptedImage(data)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of decrypted image
  async function getDecryptedImage(data) {
    const encryptedBuffer = await axios.get(data.url, { responseType: 'arraybuffer' }).then(res => res.data);
    const parsedKey = new Uint8Array(data.key.match(/.{1,2}/g).map(e => parseInt(e, 16)));
    const decryptedBuffer = new Uint8Array(encryptedBuffer).map((byte, index) => byte ^ parsedKey[index % parsedKey.length]);

    return new Blob([decryptedBuffer], { type: 'image/png' });
  }

})(axios, JSZip, saveAs, ImageDownloader);
