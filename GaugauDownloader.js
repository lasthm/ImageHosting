// ==UserScript==
// @name         GaugauDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for specific for Speedbinb reader
// @icon         https://gammaplus.takeshobo.co.jp/img/common/favicon.ico
// @homepageURL  https://greasyfork.org/zh-CN/scripts/451879-speedbinbdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://*.futabanet.jp/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_info
// ==/UserScript==

(async function (axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  const params = new URL(window.location.href).searchParams;

  // get base URL
  const href = window.location.href;
  const baseURL = /futabanet\.jp/.test(href) ? href.split('?')[0].trim() : href;

  // get cid
  const cid = baseURL.split('jp/')[1].trim();
  if (!cid) return;

  // get 'u' params and combine them
  const uParams = Array(10).fill().map((_, index) => {
    const param = params.get(`u${index}`);
    return param ? `&u${index}=${param}` : '';
  }).join('');

  // generate config data
  const randomString = SpeedReaderTools.generateRandomString32(cid);
  const config = await new Promise(async resolve => {
    const result = {};
    while (!result.p) { // try until getting data successfully
      await axios({
        method: 'GET',
        url: `https://reader.futabanet.jp/sws/bibGetCntntInfo.php?cid=${cid}&dmytime=${Date.now()}&k=${randomString}${uParams}`
      }).then(res => {
        const data = res.data.items[0];
        if (data.p) {
          result.title = data.Title;
          result.contentServer = data.ContentsServer;
          result.ctbl = SpeedReaderTools.getDecryptedTable(cid, randomString, data.ctbl);
          result.ptbl = SpeedReaderTools.getDecryptedTable(cid, randomString, data.ptbl);
          result.p = data.p;
          resolve(result);
        }
      });
    }
  });
  
  // get data of image files
  const files = await axios({
    method: 'GET',
    url: `${config.contentServer}/sbcGetCntnt.php?cid=${cid}&p=${config.p}&dmytime=${Date.now()}${uParams}`
  }).then(res => {
    const matchResult = res.data.ttx.matchAll(/(?<filename>(pages|images)\/[a-zA-Z0-9_]*.jpg)[^A-Z]*orgwidth="(?<width>\d*)" orgheight="(?<height>\d*)"/gm);
    const result = Array.from(matchResult).map(match => ({
      filename: match.groups.filename,
      width: match.groups.width,
      height: match.groups.height,
      src: `${config.contentServer}/sbcGetImg.php?cid=${cid}&src=${match.groups.filename}&p=${config.p}&q=1`
    }));
    return result.slice(0, result.length / 2);
  });

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: files.length,
    getImagePromises,
    title: config.title
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return files
      .slice(startNum - 1, endNum)
      .map(file => getDecryptedImage(file)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of decrypted image
  function getDecryptedImage(file) {
    return new Promise(async resolve => {
      const imageArrayBuffer = await new Promise(resolve => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: file.src,
          responseType: 'arraybuffer',
          onload: res => resolve(res.response)
        });
      });

      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function () {
        // create canvas
        const canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = file.width;
        canvas.height = file.height;

        // get coords
        const key = SpeedReaderTools.getDecryptionKey(file.filename, config.ctbl, config.ptbl);
        const decoder = new SpeedReaderTools.CoordDecoder(key[0], key[1]);
        const coords = decoder.getCoords(this);

        // draw pieces on correct position
        for (const { srcX, srcY, destX, destY, width, height } of coords) {
          ctx.drawImage(this, srcX, srcY, width, height, destX, destY, width, height);
        }

        canvas.toBlob(resolve);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader, SpeedReaderTools);
