document.getElementById("download").addEventListener("click", function (e) {
 	chrome.downloads.showDefaultFolder();
});
document.getElementById("options").addEventListener("click", function (e) {
 	chrome.runtime.openOptionsPage();
});