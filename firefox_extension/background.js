var currentTab;
var currentBookmark;
let extensionName = "bookmark_to_disk";

/*
 * Updates the browserAction icon to reflect whether the current page
 * is already bookmarked.
 */
function updateIcon() {
  browser.browserAction.setIcon({
    path: currentBookmark ? {
      19: "icons/star-filled-19.png",
      38: "icons/star-filled-38.png"
    } : {
      19: "icons/star-empty-19.png",
      38: "icons/star-empty-38.png"
    },
    tabId: currentTab.id
  });
  browser.browserAction.setTitle({
    // Screen readers can see the title
    title: currentBookmark ? 'Unbookmark it!' : 'Bookmark it!',
    tabId: currentTab.id
  }); 
}

/*
 * Add or remove the bookmark on the current page.
 */
function toggleBookmark() {
  if (currentBookmark) {
    browser.bookmarks.remove(currentBookmark.id);
  } else {
    browser.bookmarks.create({title: currentTab.title, url: currentTab.url});
  }
}

/*
 * Switches currentTab and currentBookmark to reflect the currently active tab
 */
function refreshBookmarkList() {
    var gettingTree = browser.bookmarks.getTree();
    gettingTree.then(logTree, onRejected);
}

// listen for bookmarks being created
browser.bookmarks.onCreated.addListener(refreshBookmarkList);

// listen for bookmarks being removed
browser.bookmarks.onRemoved.addListener(refreshBookmarkList);

// update when the extension loads initially
refreshBookmarkList();

function logItems(bookmarkItem, indent) {
    if (bookmarkItem.url && bookmarkItem.url.startsWith('http')) {
        var out = {
            uid: bookmarkItem.id,
            title: bookmarkItem.title,
            arg: bookmarkItem.url
        };
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

function logTree(bookmarkItems) {
    let content = logItems(bookmarkItems[0], 0);
    let sContent = JSON.stringify(content, null, 2);
    var sending = port.postMessage(sContent);
    console.log('Posted bookmarks to script');
}

function onRejected(error) {
    console.log(`An error: ${error}`);
}

