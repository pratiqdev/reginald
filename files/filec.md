
Stack Overflow

    Products

    user avatar
    pratiqdev
        51 , 51 reputation
        ●11 silver badge●66 bronze badges

    Home
        Public

Questions
Tags
Users
Companies
Collectives

    Explore Collectives

    Teams

        Create free Team

Node.js check if path is file or directory
Asked 9 years, 3 months ago
Modified 6 months ago
Viewed 328k times
511
67

I can't seem to get any search results that explain how to do this.

All I want to do is be able to know if a given path is a file or a directory (folder).
node.js
path
directory
filesystems
fs
Share
Edit
Follow
Flag
edited Feb 4, 2019 at 13:22
user avatar
hippietrail
14.9k1616 gold badges9696 silver badges147147 bronze badges
asked Mar 26, 2013 at 6:32
user avatar
ThomasReggi
49.1k7979 gold badges219219 silver badges382382 bronze badges
Add a comment
7 Answers
Sorted by:
809

The following should tell you. From the docs:

fs.lstatSync(path_string).isDirectory() 

    Objects returned from fs.stat() and fs.lstat() are of this type.

    stats.isFile()
    stats.isDirectory()
    stats.isBlockDevice()
    stats.isCharacterDevice()
    stats.isSymbolicLink() // (only valid with fs.lstat())
    stats.isFIFO()
    stats.isSocket()

NOTE:

The above solution will throw an Error if; for ex, the file or directory doesn't exist.

If you want a true or false approach, try fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory(); as mentioned by Joseph in the comments below.
Share
Edit
Follow
Flag
edited May 13, 2021 at 10:37
user avatar
Zade Viggers
1766 bronze badges
answered Mar 26, 2013 at 6:36
user avatar
Jason Sperske
28.8k88 gold badges6767 silver badges121121 bronze badges

    20

Note that the asynchronous version is usually preferable if you care about general app performance. – 
AlexMA
Mar 14, 2014 at 20:10
49
Keep in mind that if the directory or file does not exist, then you will get an error back. – 
Ethan Mick
Dec 27, 2014 at 20:12
20
let isDirExists = fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory(); – 
Jossef Harush Kadouri
Jul 29, 2018 at 9:15
1
I find it odd that when they first made lstat they didnt just include an exists() function in there? I guess this is why node_modules is deeper than a black hole. – 
Johncl
Feb 17, 2021 at 7:50
1
Why is everyone using fs.lstat()? The docs say it will always be false: "If the <fs.Stats> object was obtained from fs.lstat(), this method [<fs.Stats>.isDirectory()] will always return false. This is because fs.lstat() returns information about a symbolic link itself and not the path it resolves to." – 
snickle
Feb 3 at 21:33

Add a comment  |  Show 4 more comments
87
Update: Node.Js >= 10

We can use the new fs.promises API

const fs = require('fs').promises;

(async() => {
    const stat = await fs.lstat('test.txt');
    console.log(stat.isFile());
})().catch(console.error)

Any Node.Js version

Here's how you would detect if a path is a file or a directory asynchronously, which is the recommended approach in node. using fs.lstat

const fs = require("fs");

let path = "/path/to/something";

fs.lstat(path, (err, stats) => {

    if(err)
        return console.log(err); //Handle error

    console.log(`Is file: ${stats.isFile()}`);
    console.log(`Is directory: ${stats.isDirectory()}`);
    console.log(`Is symbolic link: ${stats.isSymbolicLink()}`);
    console.log(`Is FIFO: ${stats.isFIFO()}`);
    console.log(`Is socket: ${stats.isSocket()}`);
    console.log(`Is character device: ${stats.isCharacterDevice()}`);
    console.log(`Is block device: ${stats.isBlockDevice()}`);
});

Note when using the synchronous API:

    When using the synchronous form any exceptions are immediately thrown. You can use try/catch to handle exceptions or allow them to bubble up.

try{
     fs.lstatSync("/some/path").isDirectory()
}catch(e){
   // Handle error
   if(e.code == 'ENOENT'){
     //no such file or directory
     //do something
   }else {
     //do something else
   }
}

Share
Edit
Follow
Flag
edited Mar 11, 2020 at 19:59
answered Apr 30, 2017 at 0:42
user avatar
Marcos Casagrande
34.1k77 gold badges7474 silver badges8989 bronze badges

Is this still considered experimental as of Mar. 2020? Where can we look to see? -- Oops I see when I click the link above that it's now stable (which implies no longer experimental). – 
alfreema
Mar 9, 2020 at 18:54

Add a comment
31

Seriously, question exists five years and no nice facade?

function isDir(path) {
    try {
        var stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        // lstatSync throws an error if path doesn't exist
        return false;
    }
}

Share
Edit
Follow
Flag
edited Mar 31, 2021 at 12:05
user avatar
Hubro
52.7k6363 gold badges211211 silver badges364364 bronze badges
answered Nov 29, 2018 at 0:31
user avatar
kungfooman
4,02711 gold badge3838 silver badges2828 bronze badges

[Error: EACCES: permission denied, scandir '/tmp/snap.skype'] when I provide /tmp/ which is a dir and accessible. – 
Marinos An
Jun 22, 2021 at 18:02

    @MarinosAn I would assume you don't have read permission for that file, so it fails. – 
    Clonkex
    Mar 7 at 2:28

Add a comment
14

Depending on your needs, you can probably rely on node's path module.

You may not be able to hit the filesystem (e.g. the file hasn't been created yet) and tbh you probably want to avoid hitting the filesystem unless you really need the extra validation. If you can make the assumption that what you are checking for follows .<extname> format, just look at the name.

Obviously if you are looking for a file without an extname you will need to hit the filesystem to be sure. But keep it simple until you need more complicated.

const path = require('path');

function isFile(pathItem) {
  return !!path.extname(pathItem);
}

Share
Edit
Follow
Flag
answered Mar 19, 2019 at 20:57
user avatar
cndw
15711 silver badge22 bronze badges

    3

Obviously this won't work in all situations but it's much quicker and easier than the other answers if you can make the needed assumptions. – 
electrovir
Apr 9, 2019 at 2:47
4
the directory could be named folder.txt and this would say its a file, or the file could be LICENSE with no extensin – 
wow ow
Jun 23, 2020 at 11:43

Add a comment
6
If you need this when iterating over a directory1

Since Node 10.10+, fs.readdir has withFileTypes option which makes it return directory entry fs.Dirent instead of just filename. Directory entry contains its name and useful methods such as isDirectory or isFile, so you don't need to call fs.lstat explicitly!

You can use it like this then:

import { promises as fs } from 'fs';

// ./my-dir has two subdirectories: dir-a, and dir-b
const dirEntries = await fs.readdir('./my-dir', { withFileTypes: true });

// let's filter all directories in ./my-dir
const onlyDirs = dirEntries.filter(de => de.isDirectory()).map(de => de.name);
// onlyDirs is now [ 'dir-a', 'dir-b' ]

1) Because that's how I've found this question.
Share
Edit
Follow
Flag
answered Dec 12, 2021 at 22:00
user avatar
Zdenek F
1,32211 gold badge1212 silver badges2525 bronze badges
Add a comment
3

Here's a function that I use. Nobody is making use of promisify and await/async feature in this post so I thought I would share.

const promisify = require('util').promisify;
const lstat = promisify(require('fs').lstat);

async function isDirectory (path) {
  try {
    return (await lstat(path)).isDirectory();
  }
  catch (e) {
    return false;
  }
}

Note : I don't use require('fs').promises; because it has been experimental for one year now, better not rely on it.
Share
Edit
Follow
Flag
edited Mar 16, 2020 at 14:35
answered Apr 4, 2019 at 8:16
user avatar
vdegenne
10.5k1414 gold badges7474 silver badges100100 bronze badges
Add a comment
1

The answers above check if a filesystem contains a path that is a file or directory. But it doesn't identify if a given path alone is a file or directory.

    The answer is to identify directory-based paths using "/." like --> "/c/dos/run/." <-- trailing period.

Like a path of a directory or file that has not been written yet. Or a path from a different computer. Or a path where both a file and directory of the same name exists.

// /tmp/
// |- dozen.path
// |- dozen.path/.
//    |- eggs.txt
//
// "/tmp/dozen.path" !== "/tmp/dozen.path/"
//
// Very few fs allow this. But still. Don't trust the filesystem alone!

// Converts the non-standard "path-ends-in-slash" to the standard "path-is-identified-by current "." or previous ".." directory symbol.
function tryGetPath(pathItem) {
    const isPosix = pathItem.includes("/");
    if ((isPosix && pathItem.endsWith("/")) ||
        (!isPosix && pathItem.endsWith("\\"))) {
        pathItem = pathItem + ".";
    }
    return pathItem;
}
// If a path ends with a current directory identifier, it is a path! /c/dos/run/. and c:\dos\run\.
function isDirectory(pathItem) {
    const isPosix = pathItem.includes("/");
    if (pathItem === "." || pathItem ==- "..") {
        pathItem = (isPosix ? "./" : ".\\") + pathItem;
    }
    return (isPosix ? pathItem.endsWith("/.") || pathItem.endsWith("/..") : pathItem.endsWith("\\.") || pathItem.endsWith("\\.."));
} 
// If a path is not a directory, and it isn't empty, it must be a file
function isFile(pathItem) {
    if (pathItem === "") {
        return false;
    }
    return !isDirectory(pathItem);
}

Node version: v11.10.0 - Feb 2019

    Last thought: Why even hit the filesystem?

Share
Edit
Follow
Flag
edited Feb 24, 2019 at 10:29
answered Feb 24, 2019 at 6:20
user avatar
TamusJRoyce
73611 gold badge1111 silver badges2525 bronze badges

what if the folder name has a dot at the end of it, like .git or even myFolder.txt? – 
wow ow
Jun 23, 2020 at 11:44
You have to understand posix filepath conventions (which windows, in part, adheres to since Windows is posix complient in the kernel level). Please read stackoverflow.com/questions/980255/… and en.wikipedia.org/wiki/… – 
TamusJRoyce
Jun 23, 2020 at 16:06
Didn't really answer this did I? .git and myFolder.txt can be either a folder or a file. You don't know until you check. Since folders are also considered file, you cannot have a folder and a file named the same. .git/. and myFolder.txt/. are both folders. .git/ and myFolder.txt/ are all the files within that folder. man readline documents this (obscurely). The lone . is special. files/folders containing . are not. – 
TamusJRoyce
Apr 16, 2021 at 16:08

    . and .. are both special – 
    TamusJRoyce
    Apr 16, 2021 at 16:14

Add a comment
Your Answer

    Links Images Styling/Headers Lists Blockquotes Code HTML Tables
    Advanced help

Community wiki
Not the answer you're looking for? Browse other questions tagged node.js path directory filesystems fs or ask your own question.

    The Overflow Blog

Skills that pay the bills for software developers (Ep. 460)

    A conversation with Stack Overflow’s new CTO, Jody Bailey (Ep. 461)
    Featured on Meta
    Testing new traffic management tool
    Duplicated votes are being cleaned up
    Trending: A new answer sorting option
    Should we burninate the [customer] tag?
    Updated button styling for vote arrows: currently in A/B testing
    Hot Meta Posts
    15
    Should we merge [swiper] and [swiper.js]?

Linked
109
Should a directory path variable end with a trailing slash?
0
How to check if path is a directory or file?
2
Error on require("fs")
0
Node.js check if path is directory error
Related
5768
How can I get the directory where a Bash script is located from within the script itself?
4992
How do I add an empty directory to a Git repository?
5242
How can I safely create a nested directory?
1427
How do you get a list of the names of all files present in a directory in Node.js?
1184
How do I get the path to the current script with Node.js?
3467
How do I list all files of a directory?
1274
How do I get the full path of the current file's directory?
2130
How to change permissions for a folder and its subfolders/files in one step
1441
Check synchronously if file/directory exists in Node.js
Hot Network Questions

    Is it possible to have cabinet collective responsibility while allowing parliament to remove individual ministers?
    What are parameters I can use to compare two researchers' work in Pure Mathematics?
    What is an adjustable wrench fit for tightening bolts?
    Support staff can reset some User passwords but not all?
    How do you make a super villain's plan smart enough to outwit genuinely intelligent heroes but still have the heroes win?
    Simplicity Itself?
    How to put Microsoft Teams call on hold?
    Is Rubezov still alive?
    4-layer PCB - Using bottom layer as power plane
    Is it legal to break into a locked car to get a child out in hot weather?
    When did this SQL request yield results?
    Force field vacuum bubble as method for escaping planetary gravity
    Squash it ... again!
    Is "This sentence is written in english" a nonsense?
    Vertical transition, 0-0 transition, and experimental spectra
    If nuclear weapons were never existed or invented, what could replace it
    Medieval Footwear in swamplands
    Whenever I try to edit /etc/hosts with Vi or Nano /private/etc/hosts is opened instead
    Plotting resolvent of the matrix
    What is a Writ and who can issue one?
    Implementation of Matlab's "numgrid" function
    Children's book with "a ring, a stone, a finger bone"
    Military sci-fi: warrior-spy codenamed GENIE, Greatest Effectiveness Nexus Identification and Elimination fights mercenaries
    Why did my LED drivers blow up?

Question feed

Stack Overflow

    Questions
    Help

Products

    Teams
    Advertising
    Collectives
    Talent

Company

    About
    Press
    Work Here
    Legal
    Privacy Policy
    Terms of Service
    Contact Us
    Cookie Settings
    Cookie Policy

Stack Exchange Network

    Technology
    Culture & recreation
    Life & arts
    Science
    Professional
    Business
    API
    Data

    Blog
    Facebook
    Twitter
    LinkedIn
    Instagram

Site design / logo © 2022 Stack Exchange Inc; user contributions licensed under cc by-sa. rev 2022.7.8.42556
 