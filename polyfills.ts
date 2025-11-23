// This file provides a polyfill for crypto.randomUUID for environments
// where it's not available (e.g., non-secure contexts over HTTP).

if (typeof crypto === 'undefined' || typeof crypto.randomUUID === 'undefined') {
  // @ts-ignore
  globalThis.crypto = {
    // @ts-ignore
    randomUUID: () => {
      let d = new Date().getTime(),
        d2 = (performance?.now && performance.now() * 1000) || 0;
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let r = Math.random() * 16;
        if (d > 0) {
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
    },
  };
}