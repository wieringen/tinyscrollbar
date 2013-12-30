[tinyscrollbar](http://baijs.com/tinyscrollbar) [![Build Status](https://secure.travis-ci.org/wieringen/tinyscrollbar.png?branch=master)](http://travis-ci.org/wieringen/tinyscrollbar)
==================================================

What you need to build your own version of tinyscrollbar
--------------------------------------

In order to build tinyscrollbar, you need to have Node.js/npm, and git 1.7 or later installed.


How to build your own tinyscrollbar
----------------------------

First, clone a copy of the main imageCreator git repo by running:

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

The built version of tinyscrollbar will be put in the `dist/` subdirectory, along with the minified copy and associated map file.


Questions?
----------

If you have any questions, please feel free to email [me](mailto:wieringen@gmail.com).


