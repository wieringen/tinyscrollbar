module.exports = ( grunt ) ->

    grunt.initConfig

        pkg : grunt.file.readJSON "package.json"

        #  Banner we want to show above the minified js files.
        #
        banner : '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n ' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n *\\n " : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> <<%= pkg.author.email %>>;\n' +
        ' * Licensed under the <%= _.pluck(pkg.licenses, "type").join(", ") %> license */\n\n'

        #  Remove old build.
        #
        clean :

            dist :

                src : ["dist"]

        #  Copy the images and the index to the dist location.
        #
        copy :

            docs :

                files : [
                    { expand: true, cwd: "docs", src: "**/*", dest: "dist/docs", dot: true }
                    { expand: true, cwd: "node_modules/baijs", src: "css/**/*", dest: "dist/docs" }
                    { expand: true, cwd: "node_modules/baijs", src: "js/**/*",  dest: "dist/docs" }
                    { expand: true, cwd: "lib",  src: "**/*", dest: "dist/docs/js" }
                ]

            examples :

                files : [
                    { expand: true, cwd: "examples", src: "**/*",                     dest: "dist/examples" }
                    { expand: true, cwd: "lib", src: "jquery.<%= pkg.name %>*", dest: "dist/examples/infinite" }
                    { expand: true, cwd: "lib", src: "jquery.<%= pkg.name %>*", dest: "dist/examples/simple" }
                    { expand: true, cwd: "lib", src: "jquery.<%= pkg.name %>*", dest: "dist/examples/responsive" }
                    { expand: true, cwd: "lib", src: "<%= pkg.name %>*",        dest: "dist/examples/nojquery" }
                ]

        #  Validate javascript files with jsHint.
        #
        jshint :

            options :

                jshintrc : ".jshintrc"

            all : [
                "lib/jquery.<%= pkg.name %>.js"
                "lib/<%= pkg.name %>.js"
            ]

        #  Minify the javascript.
        #
        uglify :

            lib :

                options :

                    banner   : "<%= banner %>"
                    beautify : false

                files :

                    "lib/jquery.<%= pkg.name %>.min.js" : ["lib/jquery.<%= pkg.name %>.js"]
                    "lib/<%= pkg.name %>.min.js"        : ["lib/<%= pkg.name %>.js"]

        #  Replace image file paths in css and correct css path in the index.
        #
        replace :

            dist :

                src : [
                    "dist/docs/index.html"
                    "dist/examples/**/*.html"
                ]
                overwrite     : true
                replacements  : [
                    {
                        from : /@@bnr@@/ig
                        to   : "<%= pkg.version %>"
                    }
                    {
                        from : /..\/node_modules\/baijs\//ig
                        to   : ""
                    }
                    {
                        from : /..\/..\/lib\//ig
                        to   : ""
                    }
                    {
                        from : /..\/lib\//ig
                        to   : "js/"
                    }

                ]

        #  Make a zipfile from the dist and examples.
        #
        compress :

            docs :

                options :

                    archive: "dist/<%= pkg.name %>-<%= pkg.version %>-docs.zip"

                expand : true
                cwd    : "dist/docs"
                src    : ["**/*"]
                dest   : "."

            examples :

                options :

                    archive: "dist/<%= pkg.name %>-<%= pkg.version %>.zip"

                expand : true
                cwd    : "dist/examples"
                src    : ["**/*"]
                dest   : "."

        #  Deploy plugin to baijs.com
        #
        "ftp-deploy" :

            docs :

                auth :

                    host    : "ftp.baijs.nl"
                    port    : 21
                    authKey : "<%= pkg.name %>"

                src  : "dist/docs"
                dest : "/"

            examples :

                auth :

                    host    : "ftp.baijs.nl"
                    port    : 21
                    authKey : "<%= pkg.name %>"

                src  : "dist/"
                dest : "/"
                exclusions: ["docs", "<%= pkg.name %>-<%= pkg.version %>-docs.zip"]

    #  Load all the task modules we need.
    #
    grunt.loadNpmTasks "grunt-contrib-copy"
    grunt.loadNpmTasks "grunt-contrib-clean"
    grunt.loadNpmTasks "grunt-contrib-uglify"
    grunt.loadNpmTasks "grunt-text-replace"
    grunt.loadNpmTasks "grunt-contrib-compress"
    grunt.loadNpmTasks "grunt-ftp-deploy"
    grunt.loadNpmTasks "grunt-contrib-jshint"

    #  Dist build
    #
    grunt.registerTask(
        "default"
        [
            "jshint"
            "clean:dist"
            "copy:docs"
            "uglify:lib"
            "copy:examples"
            "replace:dist"
            "compress:docs"
            "compress:examples"
        ]
    )

    #  Upload dist to baijs.nl
    #
    grunt.registerTask(
        "ftp"
        [
            "default"
            "ftp-deploy:docs"
            "ftp-deploy:examples"
        ]
    )