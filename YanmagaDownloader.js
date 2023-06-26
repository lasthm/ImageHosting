// ==UserScript==
// @name         YanmagaDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for yanmaga.jp
// @icon         https://yanmaga.jp/favicon.ico
// @homepageURL  https://greasyfork.org/zh-CN/scripts/451884-yanmagadownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://yanmaga.jp/comics/*/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_info
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get title
  const title1 = document.querySelector('.episode-info-title').innerText;
  const title2 = document.querySelector('.episode-header-title').innerText;

  // get data of images
  const info = document.getElementById('comici-viewer');
  const baseUrl = `https://api2-yanmaga.comici.jp/book/contentsInfo?user-id=${info.dataset.memberJwt}&comici-viewer-id=${info.getAttribute('comici-viewer-id')}&page-from=0&page-to=`;
  const pageCount = await axios.get(baseUrl + '1').then(res => res.data.totalPages);
  const imageData = await axios.get(baseUrl + pageCount).then(res => res.data.result);

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: imageData.length,
    getImagePromises,
    title: `${title1} ${title2}`,
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return imageData
      .slice(startNum - 1, endNum)
      .map(data => getDecryptedImage(data)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of decrypted image 
  function getDecryptedImage(data) {
    return new Promise(async resolve => {
      const image = document.createElement('img');
      image.src = await axios
        .get(data.imageUrl, { responseType: 'arraybuffer' })
        .then(res => 'data:image/jpg;base64,' + window.btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')));
      image.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = data.width;
        canvas.height = data.height;
        ctx.drawImage(this, 0, 0);

        // the following code are scrambled code from viewer.js
        const l = Math.floor(data.width / 4);
        const d = Math.floor(data.height / 4);

        const In = [];
        for (let kn = 0, Sn = 0; Sn < 4; Sn++) {
          for (let On = 0; On < 4; On++) {
            In[kn++] = [Sn, On];
          }
        }

        const p = function(e, t) {
          for (var n = e.length, r = [], i = t.replace(/\s+/g, "").slice(1).slice(0, -1).split(","), a = 0; a < n; a++) {
            r.push(e[i[a]]);
          }

          return r;
        }(In, data.scramble);

        for(let f = 0, v = 0; v < 4; v++) {
          for (let h = 0; h < 4; h++) {
            const g = p[f][0];
            const m = p[f][1];
            f++;

            ctx.drawImage(this, l * g, d * m, l, d, l * v, d * h, l, d);
          }
        }

        canvas.toBlob(resolve);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);
