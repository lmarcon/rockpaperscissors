// domready - credits to http://beeker.io/jquery-document-ready-equivalent-vanilla-javascript
export function domReady(callback) {
	document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
}
