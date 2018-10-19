# Installation

- copy the python script somewhere on your disk
- copy the [Native Manifest](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_manifests) in `~/Library/Application Support/Mozilla/NativeMessagingHosts/bookmark_to_disk.json`
- **update the python path in the manifest**
- install the FF extension

# Testing

- check that it creates a `/tmp/bookmarks.json` file
- if should update when you add/remove a bookmark
- run the Alfred workflow using the `ff` keyword. All your bookmarks should show!
