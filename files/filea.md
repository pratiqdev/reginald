
Skip to content
Pull requests
Issues
Marketplace
Explore
@pratiqdev
oraad /
cordova-react-template
Public

Code
Issues 3
Pull requests
Actions
Projects
Wiki
Security

    Insights

npm stat => TypeError: dirent.isDirectory is not a function #1
Open
damienmarchandfr opened this issue on Jun 13, 2019 · 1 comment
Open
npm stat => TypeError: dirent.isDirectory is not a function
#1
damienmarchandfr opened this issue on Jun 13, 2019 · 1 comment
Comments
@damienmarchandfr
damienmarchandfr commented on Jun 13, 2019

OS : Linux
Command : cordova platform add browser / npm start

Output :

    damien@damien-P553UA:~/Dev/MyReactApp$ npm start

    helloworld@1.0.0 start /home/damien/Dev/MyReactApp
    node assets/scripts/start-dev.js

    Setting up Symbolic links...
    (node:3592) UnhandledPromiseRejectionWarning: TypeError: dirent.isDirectory is not a function
    at fs.readdirSync.filter (/home/damien/Dev/MyReactApp/assets/scripts/symlink.js:114:36)
    at Array.filter ()
    at listPlatforms (/home/damien/Dev/MyReactApp/assets/scripts/symlink.js:114:10)
    at Object.createSymlink [as create] (/home/damien/Dev/MyReactApp/assets/scripts/symlink.js:40:56)
    at Object.start (/home/damien/Dev/MyReactApp/assets/scripts/dev-env.js:31:13)
    at Object. (/home/damien/Dev/MyReactApp/assets/scripts/start-dev.js:11:8)
    at Module._compile (module.js:652:30)
    at Object.Module._extensions..js (module.js:663:10)
    at Module.load (module.js:565:32)
    at tryModuleLoad (module.js:505:12)
    (node:3592) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
    (node:3592) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
    ^CStopping Dev Server...
    Cleaning up Symbolic Links...
    /home/damien/Dev/MyReactApp/assets/scripts/symlink.js:66
    if (dirent.isSymbolicLink()) {
    ^

    TypeError: dirent.isSymbolicLink is not a function
    at fs.readdirSync.forEach.dirent (/home/damien/Dev/MyReactApp/assets/scripts/symlink.js:66:24)
    at Array.forEach ()
    at Object.cleanupSymlink [as cleanup] (/home/damien/Dev/MyReactApp/assets/scripts/symlink.js:64:10)
    at Object.stop (/home/damien/Dev/MyReactApp/assets/scripts/dev-env.js:143:13)
    at process. (/home/damien/Dev/MyReactApp/assets/scripts/start-dev.js:22:16)
    at emitNone (events.js:106:13)
    at process.emit (events.js:208:7)
    at Signal.wrap.onsignal (internal/process.js:208:44)

@d9media
d9media commented on Jan 18, 2020

I was seeing this issue on Windows and solved it by updating Node to the latest version. Hope this helps
@pratiqdev
Attach files by dragging & dropping, selecting or pasting them.
Remember, contributions to this repository should follow our GitHub Community Guidelines.
Assignees
No one assigned
Labels
None yet
Projects
None yet
Milestone
No milestone
Development

No branches or pull requests
Notifications
Customize

You’re not receiving notifications from this thread.
2 participants
@d9media
@damienmarchandfr
Footer
© 2022 GitHub, Inc.
Footer navigation

    Terms
    Privacy
    Security
    Status
    Docs
    Contact GitHub
    Pricing
    API
    Training
    Blog
    About

You have unread notifications