// ==UserScript==
// @name         CycomiDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.2
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for cycomi.com
// @icon         https://cycomi.com/favicon.ico
// @homepageURL  https://github.com/Timesient/manga-download-scripts
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://cycomi.com/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_info
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = /https:\/\/cycomi\.com\/viewer\/chapter\/.*/;
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

  // capture the auth token
  let token = '';
  const originConcat = String.prototype.concat;
  String.prototype.concat = function() {
    if (this === 'token ') token = arguments[0]
    return originConcat.apply(this, arguments);
  }

  // get chapter ID
  const chapterID = window.location.pathname.split('/').pop();

  // get manga ID & chapter title
  const { titleId: mangaID, titleName: titleName, name: chapterTitle, subName: chapterSubTitle } = await axios.get(`https://web.cycomi.com/api/chapter/detail?chapterId=${chapterID}`).then(res => res.data.data);

  const pages = await new Promise(resolve => {
    const timer = setInterval(async () => {
      const result = await axios({
        method: 'POST',
        url: 'https://web.cycomi.com/api/chapter/page/list',
        data: {
          titleId: mangaID,
          chapterId: chapterID
        },
        headers: { 'Authorization': `token ${token}` }
      }).then(res => res.data.data.pages.filter(page => /\/(?<hash>[0-9a-zA-Z]{32})\//.test(new URL(page.image).pathname)));

      if (result.length > 0) {
        resolve(result);
        clearInterval(timer);
      }
    }, 2000);
  });

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pages.length,
    getImagePromises,
    title: `${titleName} ${chapterTitle} ${chapterSubTitle}`,
    zipOptions: { base64: true }
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return pages
      .slice(startNum - 1, endNum)
      .map(page => getImage(page)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of image
  async function getImage(page) {
    const hash = new URL(page.image).pathname.match(/\/(?<hash>[0-9a-zA-Z]{32})\//).groups.hash;
    const encryptedImageData = await axios({
      method: 'GET',
      url: page.image,
      responseType: 'arraybuffer'
    }).then(res => res.data);

    const decrypt = async (e, t) => {
      let n = (e => {
          let t = new Uint8Array(256);
          t.forEach((e, n)=>{
            t[n] = n
          });
          let n = 0;
          return t.forEach((i,r)=>{
            n = (n + t[r] + e.charCodeAt(r % e.length)) % 256;
            let l = t[r];
            t[r] = t[n],
            t[n] = l
          }),
          t
      })(t)
        , i = 0
        , r = 0
        , l = new Uint8Array(e.length);

      for (let t = 0, a = e.length; t < a; t++) {
        r = (r + n[i = (i + 1) % 256]) % 256;
        let a = n[i % 256];
        n[i % 256] = n[r],
        n[r] = a;
        let o = n[(n[i] + n[r]) % 256];
        l[t] = o ^ e[t]
      }

      const dataURL = await new Promise((resolve, reject) => {
        let i = new FileReader;
        i.addEventListener('error', reject);
        i.addEventListener('load', () => resolve(i.result));
        i.readAsDataURL(new Blob([l]));
      });

      return dataURL.split(',')[1];
    }

    return await decrypt(new Uint8Array(encryptedImageData), hash);
  }

})(axios, JSZip, saveAs, ImageDownloader);
