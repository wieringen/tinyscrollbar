module.exports = ( grunt ) ->

    grunt.initConfig

        #  Path constants
        #
        PRO_PATH : "dist/src"
        DEV_PATH : "src"

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

                src : ["<%= PRO_PATH %>"]

        #  Copy the images and the index to the dist location.
        #
        copy :

            dist :

                files : [
                    { expand: true, cwd: "<%= DEV_PATH %>",    src: "images/**/*", dest: "<%= PRO_PATH %>" }
                    { expand: true, cwd: "<%= DEV_PATH %>",    src: "css/**/*",    dest: "<%= PRO_PATH %>" }
                    { expand: true, cwd: "node_modules/baijs", src: "css/**/*",    dest: "<%= PRO_PATH %>" }
                    { expand: true, cwd: "node_modules/baijs", src: "js/**/*",     dest: "<%= PRO_PATH %>" }
                    { expand: true, cwd: "<%= DEV_PATH %>",    src: "js/**/*",     dest: "<%= PRO_PATH %>" }
                    { expand: true, cwd: "<%= DEV_PATH %>",    src: "index.html",  dest: "<%= PRO_PATH %>" }
                ]

            examples :

                files : [
                    { expand: true, cwd: "<%= DEV_PATH %>", src: "examples/**/*",              dest: "<%= PRO_PATH %>" }
                    { expand: true, cwd: "<%= DEV_PATH %>", src: "js/jquery.<%= pkg.name %>*", dest: "<%= PRO_PATH %>/examples/infinite/js" }
                    { expand: true, cwd: "<%= DEV_PATH %>", src: "js/jquery.<%= pkg.name %>*", dest: "<%= PRO_PATH %>/examples/simple/js" }
                    { expand: true, cwd: "<%= DEV_PATH %>", src: "js/jquery.<%= pkg.name %>*", dest: "<%= PRO_PATH %>/examples/responsive/js" }
                    { expand: true, cwd: "<%= DEV_PATH %>", src: "js/<%= pkg.name %>*",        dest: "<%= PRO_PATH %>/examples/nojquery/js" }
                ]

        #  Validate javascript files with jsHint.
        #
        jshint :

            options :

                jshintrc : ".jshintrc"

            all : [
                "<%= DEV_PATH %>/js/jquery.<%= pkg.name %>.js"
                "<%= DEV_PATH %>/js/<%= pkg.name %>.js"
            ]

        #  Minify the javascript.
        #
        uglify :

            dist :

                options :

                    banner   : "<%= banner %>"
                    beautify : false

                files :

                    "<%= PRO_PATH %>/js/jquery.<%= pkg.name %>.min.js" : ["<%= PRO_PATH %>/js/jquery.<%= pkg.name %>.js"]
                    "<%= PRO_PATH %>/js/<%= pkg.name %>.min.js"        : ["<%= PRO_PATH %>/js/<%= pkg.name %>.js"]


        #  Replace image file paths in css and correct css path in the index.
        #
        replace :

            dist :

                src : [
                    "<%= PRO_PATH %>/index.html"
                    "<%= PRO_PATH %>/examples/**/*.html"
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
                        from : /..\/..\/js\/js/ig
                        to   : ""
                    }
                ]

        #  Make a zipfile from the dist and examples.
        #
        compress :

            dist :

                options :

                    archive: "dist/dist-<%= pkg.version %>.zip"

                expand : true
                cwd    : "<%= PRO_PATH %>"
                src    : ["**/*"]
                dest   : "."

            examples :

                options :

                    archive: "<%= PRO_PATH %>/<%= pkg.name %>-<%= pkg.version %>.zip"

                expand : true
                cwd    : "<%= PRO_PATH %>/examples"
                src    : ["**/*"]
                dest   : "."

        #  Deploy plugin to baijs.com
        #
        "ftp-deploy" :

            dist :

                auth :

                    host    : "ftp.baijs.nl"
                    port    : 21
                    authKey : "<%= pkg.name %>"

                src  : "<%= PRO_PATH %>"
                dest : "/"

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
            "copy:dist"
            "uglify:dist"
            "compress:dist"
            "replace:dist"
            "copy:examples"
            "compress:examples"
        ]
    )

    #  Upload dist to baijs.nl
    #
    grunt.registerTask(
        "ftp"
        [
            "default"
            "ftp-deploy:dist"
        ]
    )