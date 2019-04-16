let extensionName = "bookmark_to_disk";

function refreshBookmarkList() {
    var gettingTree = browser.bookmarks.getTree();
    gettingTree.then(logTree, onRejected);
}

browser.bookmarks.onCreated.addListener(refreshBookmarkList);
browser.bookmarks.onRemoved.addListener(refreshBookmarkList);
browser.bookmarks.onChanged.addListener(refreshBookmarkList);
browser.bookmarks.onMoved.addListener(refreshBookmarkList);
browser.bookmarks.onRemoved.addListener(refreshBookmarkList);

// update when the extension loads initially
refreshBookmarkList();

function logItems(bookmarkItem, indent) {
    if (bookmarkItem.url && 
      (bookmarkItem.url.startsWith('http') || bookmarkItem.url.startsWith('file'))) {
        let out = bookmarkItem;
        return [out];
    }
    var o = [];
    if (bookmarkItem.children) {
        for (child of bookmarkItem.children) {
            o = o.concat(logItems(child, indent));
        }
    }
    return o;
}

var port = browser.runtime.connectNative(extensionName);

port.onMessage.addListener((response) => {
    console.log("Received: " + response);
});
function logTree(bookmarkItems) {
    let content = logItems(bookmarkItems[0], 0);
    let sContent = JSON.stringify(content, null, 2);
    var sending = port.postMessage(sContent);
    console.log('Posted bookmarks to script');
}

function onRejected(error) {
    console.log(`An error: ${error}`);
}

