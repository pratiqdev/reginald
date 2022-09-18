
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

Nodejs 14.5 Filesystem API what is the Dirent "Symbol(type)" property?
Asked 2 years ago
Modified 2 years ago
Viewed 453 times
0
1

I am doing some basic readdir operations and file/directory read operations with Node 14.5 and filesystem api...

I am just wondering, as I get an "Dirent" object that describes a file/directory, when I iterate through the properties of it , I can see a "[Symbol(type)]" property with a number value, thats probably the type of that file.. however I cannot access that property in any way...

Dirent {
  name: 'Some name of file.mp4',
  [Symbol(type)]: 1
}

My question now is: what is that kind of property and how could I access it? Or how can I create such a property and why does is even show up? I know I can usee methods like isDirectory() etc. but I was just interested to know what that property is...

here is my code:

const fs = require('fs');
const path = require('path');

const walkDirs = async (dir_path, isSubdir = false, round = 0) => {
  try {
    const files = await fs.promises.readdir(dir_path);
    const dirs = fs.opendirSync(dir_path);
    // console.log(dirs);
    for await (const dirent of dirs) {
      for ( let prop in dirent) {
        console.log("prop:", prop,  dirent[prop]);
      }
    }

  } catch(error) {
    console.log("Error catched: ", error);
  }
}

walkDirs("D:/", false, 0);

node.js
file
directory
filesystems
readdir
Share
Edit
Follow
Flag
asked Jul 10, 2020 at 15:39
user avatar
Marc_L
2,85077 gold badges3737 silver badges6868 bronze badges

    1

This might help javascript.info/symbol – 
Molda
Jul 10, 2020 at 16:04
1
Symbols are typically used as property names for one of two reasons: 1) when you need a property name that absolutely cannot conflict with anything else and 2) when you want some privacy of access (more formally designating a property as private - though you can still jump through hoops to get the value if you really want it). My guess here would be the privacy aspect. This is likely some data that is used by Dirent methods, but the data is not meant to be publicly documented or used. – 
jfriend00
Jul 10, 2020 at 18:08

Add a comment
1 Answer
Sorted by:
2

If you go to the fs module's source code for the DirEnt class, you find this:

class Dirent {
  constructor(name, type) {
    this.name = name;
    this[kType] = type;
  }

  isDirectory() {
    return this[kType] === UV_DIRENT_DIR;
  }

  isFile() {
    return this[kType] === UV_DIRENT_FILE;
  }

  isBlockDevice() {
    return this[kType] === UV_DIRENT_BLOCK;
  }

  isCharacterDevice() {
    return this[kType] === UV_DIRENT_CHAR;
  }

  isSymbolicLink() {
    return this[kType] === UV_DIRENT_LINK;
  }

  isFIFO() {
    return this[kType] === UV_DIRENT_FIFO;
  }

  isSocket() {
    return this[kType] === UV_DIRENT_SOCKET;
  }
}

If you then look for kType, you find this:

const kType = Symbol('type');

And, all the values in that code such as UV_DIRECT_DIR and UV_DIRENT_FILE are constants imported from libuv that describe the type of directory entry.

So, it appears that the property you are asking about contains the libuv type for the directory entry and they are using a Symbol as the property name because they do not intend for that internal implementation detail to be used publicly or documented.

If you don't know what libuv is, it's the cross platform library that nodejs uses to access OS services. It abstracts some operating system details into a common interface to allow more nodejs code to be written once and work on multiple platforms (Win/Mac/Unix).

The underlying UV constants mentioned above are defined here in C++ code in libuv in uv.h.

typedef enum {
  UV_DIRENT_UNKNOWN,
  UV_DIRENT_FILE,
  UV_DIRENT_DIR,
  UV_DIRENT_LINK,
  UV_DIRENT_FIFO,
  UV_DIRENT_SOCKET,
  UV_DIRENT_CHAR,
  UV_DIRENT_BLOCK
} uv_dirent_type_t;

Share
Edit
Follow
Flag
answered Jul 10, 2020 at 18:22
user avatar
jfriend00
642k8888 gold badges906906 silver badges912912 bronze badges
Add a comment
Your Answer

    Links Images Styling/Headers Lists Blockquotes Code HTML Tables
    Advanced help

Community wiki
Not the answer you're looking for? Browse other questions tagged node.js file directory filesystems readdir or ask your own question.

    The Overflow Blog

A conversation with Stack Overflow’s new CTO, Jody Bailey (Ep. 461)

    Stack Exchange sites are getting prettier faster: Introducing Themes
    Featured on Meta
    Testing new traffic management tool
    Duplicated votes are being cleaned up
    Trending: A new answer sorting option
    Updated button styling for vote arrows: currently in A/B testing
    Hot Meta Posts
    41
    Improve the synonym feature to upvote a request based on the reputation score...

Related
0
How to use std::fstream, boost, or anything else to create a folder file
223
What is purpose of the property "private" in package.json?
1
Android says no such file or folder even though it's there
3
Call Ethereum using web3.js on Azure Function
0
sequelize include, join two associated tables
4
How to upload an image file directly from client to AWS S3 using node, createPresignedPost, & fetch
2
Data corruption in malloc'ed memory
0
Giving error while creating server using node js
Hot Network Questions

    Can we define derived functors in model categories without functorial factorisations
    Will it hurt my chances if I state I want to study Theoretical Computer Science instead of sth like AI/ML for PhD?
    What is difference between sleep and NOP in depth?
    What is the meaning of square brackets in quotes?
    Is multiplication implicitly definable from successor?
    How do resistors work?
    Does the book title "The Art of XYZ" imply doing XYZ is an art, requiring creative skill?
    What is a salad knife?
    Tax implications of free rent as compensation
    Flashing the emergency lights at a vehicle to dim the headlights
    Simplify Rubik's Cube Moves
    Why does Kamala Khan say that her necklace is in Arabic?
    What would be the best way to kill an Albertosaurus with only stone age weapons?
    Transform nonlinear cost function to get LP or MILP
    If I wrote code for a personal project, and use some of it in a program at my company, can they now sue me for using the code in my personal project?
    Difference between saying 外国の人 and 外国人?
    What year is specialized stumpjumper sold? What rear shock does it have?
    Why can my power armor's magic lightweight fuel cells not be used for other things?
    Add a non-georeferenced image at a defined location - not a georeferencing question
    why does a ground rod wire have to be continuous?
    If the person who shares a joint bank account with makes a large purchase without the other person’s permission, what are the legal options?
    '70's-era novel about a planet (future Earth?) covered by an intelligent, continent-spanning tree, miles high
    In this image taken by Voyager 1, which is closer: the earth or the moon?
    Can something be noumenal for me and not for you?

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

Site design / logo © 2022 Stack Exchange Inc; user contributions licensed under cc by-sa. rev 2022.7.11.42569
 