// ==UserScript==
// @name         ComiciViewerDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.2
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader specific for Comici Viewer
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youngchampion.jp
// @homepageURL  https://github.com/Timesient/manga-download-scripts
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://youngchampion.jp/episodes/*
// @match        https://younganimal.com/episodes/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_info
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get episode id and domain
  const { id, domain } = await new Promise(resolve => {
    const timer = setInterval(() => {
      const viewerElement = document.getElementById('comici-viewer');
      if (viewerElement) {
        clearInterval(timer);
        resolve({
          id: document.getElementById('comici-viewer').attributes.getNamedItem('comici-viewer-id').value,
          domain: viewerElement.dataset.apiDomain
        });
      }
    }, 500);
  });

  // get title and amount of pages
  const title1 = document.querySelector('h1.series-h-title span').textContent;
  const { title2, pageCount } = await axios({
    method: 'GET',
    url: `https://${domain}/book/episodeInfo?comici-viewer-id=${id}`
  }).then(res => {
    const episodes = res.data.result;
    for (const episode of episodes) {
      if (episode.id === id) {
        return {
          title2: episode.name,
          pageCount: episode.page_count
        }
      }
    }
  });

  // get data of pages
  const userId = document.getElementById('login_user_id').textContent || '0';
  const pages = await axios.get(`https://${domain}/book/contentsInfo?user-id=${userId}&comici-viewer-id=${id}&page-from=0&page-to=${pageCount}`).then(res => res.data.result);
  console.log(pages);

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pageCount,
    getImagePromises,
    title: `${title1} ${title2}`
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return pages
      .slice(startNum - 1, endNum)
      .map(page => getDecryptedImage(page)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of decrypted image
  function getDecryptedImage(data) {
    return new Promise(async resolve => {
      const imageArrayBuffer = await axios.get(data.imageUrl, { responseType: 'arraybuffer' }).then(res => res.data);
      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function () {
        // create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;

        // get scramble dict
        const dict = [];
        const dictTemplete = JSON.parse('[[0,0],[0,1],[0,2],[0,3],[1,0],[1,1],[1,2],[1,3],[2,0],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]]');
        const scrambleOrders = JSON.parse(data.scramble);
        for (let i = 0; i < dictTemplete.length; i++) {
          dict.push(dictTemplete[scrambleOrders[i]]);
        }
        
        // start unscrambling
        const pieceWidth = Math.floor(data.width / 4);
        const pieceHeight = Math.floor(data.height / 4);
        let dictCounter = 0;
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            const x = dict[dictCounter][0];
            const y = dict[dictCounter][1];
            context.drawImage(this, pieceWidth * x, pieceHeight * y, pieceWidth, pieceHeight, pieceWidth * i, pieceHeight * j, pieceWidth, pieceHeight),
            dictCounter++
          }
        }

        // output unscrambled image
        canvas.toBlob(resolve);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);
