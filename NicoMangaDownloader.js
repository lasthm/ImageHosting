// ==UserScript==
// @name         NicoMangaDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for seiga.nicovideo.jp
// @icon         https://seiga.nicovideo.jp/favicon.ico
// @homepageURL  https://greasyfork.org/zh-CN/scripts/451874-nicomangadownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://seiga.nicovideo.jp/watch/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get url of images and title
  const urls = unsafeWindow.args.pages.map(page => page.url);
  const title1 = document.querySelector('.manga_title').innerText;
  const title2 = document.querySelector('.episode_title').innerText;

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: urls.length,
    getImagePromises,
    title: `${title1} ${title2}`,
    imageSuffix: 'png',
    positionOptions: { top: '180px' }
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
  function getImage(imageURL) {
    return new Promise(async resolve => {
      let imageSrc;
      if (imageURL.startsWith('https://drm.cdn')) {
        const imageKey = imageURL.match(/image\/([a-z0-9_]+)/)[1].split('_')[0];
        const encryptedImageData = await axios({ url: imageURL, responseType: 'arraybuffer' }).then(res => new Uint8Array(res.data));
        const decryptedImageData = decrypt(encryptedImageData, imageKey);
        imageSrc = "data:image/png;base64," + window.btoa(decryptedImageData.reduce((acc, cur) => acc + String.fromCharCode(cur), ''));
      } else {
        imageSrc = await new Promise(resolve => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: imageURL,
            responseType: 'arraybuffer',
            onload: res => resolve("data:image/webp;base64," + window.btoa(new Uint8Array(res.response).reduce((data, byte) => data + String.fromCharCode(byte), '')))
          });
        });
      }

      const image = document.createElement('img');
      image.src = imageSrc;
      image.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(this, 0, 0);
        canvas.toBlob(resolve);
      }
      
      function decrypt(e, t) {
        const r = [];
        for (let n = 0; n < 8; n++) { r.push(parseInt(t.substr(2 * n, 2), 16)); }
        for (let n = 0; n < e.length; n++) { e[n] = e[n] ^ r[n % 8]; }
        return e;
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);
