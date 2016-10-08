[tinyscrollbar](http://baijs.com/tinyscrollbar) [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![NPM version][npm-image]][npm-url]
==================================================

** HELP MAINTAINER NEEDED!! **

Environments in which to use tinyscrollbar
--------------------------------------

- Browser support differs between the jQuery plugin and the plain Javascript microlib. Specifically, the plain Javascript microlib does not support legacy browsers such as IE6-8. Use the jQuery plugin release if support for those browsers is required.
- Tinyscrollbar can also be used in Node, browser extensions, and other non-browser environments.

What you need to build your own version of tinyscrollbar
--------------------------------------

In order to build tinyscrollbar, you need to have Node.js/npm, and git 1.7 or later installed.


How to build your own tinyscrollbar
----------------------------

First, clone a copy of the main tinyscrollbar git repo by running:

```bash
git clone git://github.com/wieringen/tinyscrollbar.git
```

Install the grunt-cli package so that you will have the correct version of grunt available from any project that needs it. This should be done as a global install:

```bash
npm install -g grunt-cli
```

Enter the tinyscrollbar directory and install the Node dependencies, this time *without* specifying a global install:

```bash
cd tinyscrollbar && npm install
```

Make sure you have `grunt` installed by testing:

```bash
grunt -version
```

Then, to get a complete, minified (w/ Uglify.js), linted (w/ JSHint) version of tinyscrollbar, type the following:

```bash
grunt
```

The build version of tinyscrollbar will be put in the `dist/` subdirectory, along with the minified copy and associated map file.


Questions?
----------

If you have any questions, please feel free to email [me](mailto:wieringen@gmail.com).

[travis-image]: https://travis-ci.org/wieringen/tinyscrollbar.svg?branch=master
[travis-url]: https://travis-ci.org/wieringen/tinyscrollbar

[coveralls-image]: https://img.shields.io/coveralls/wieringen/tinyscrollbar/master.svg
[coveralls-url]: https://coveralls.io/r/wieringen/tinyscrollbar?branch=master

[npm-image]: https://badge.fury.io/js/tinyscrollbar.png
[npm-url]: http://badge.fury.io/js/tinyscrollbar


