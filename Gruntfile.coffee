module.exports = ( grunt ) ->

    grunt.loadNpmTasks "grunt-contrib-clean"
    grunt.loadNpmTasks "grunt-contrib-compress"
    grunt.loadNpmTasks "grunt-contrib-copy"
    grunt.loadNpmTasks "grunt-contrib-jshint"
    grunt.loadNpmTasks "grunt-contrib-uglify"
    grunt.loadNpmTasks "grunt-contrib-yuidoc"
    grunt.loadNpmTasks "grunt-ftp-deploy"
    grunt.loadNpmTasks "grunt-karma"
    grunt.loadNpmTasks "grunt-processhtml"

    grunt.initConfig

        pkg: grunt.file.readJSON "package.json"

        #  Banner we want to show above the minified js files.
        #
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n ' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n *\\n " : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> <<%= pkg.author.email %>>;\n' +
        ' * Licensed under the <%= _.pluck(pkg.licenses, "type").join(", ") %> license */\n\n'


        #  Validate javascript files with jsHint.
        #
        jshint:
            options:
                jshintrc: ".jshintrc"
            all: [
                "lib/jquery.<%= pkg.name %>.js"
            ]


        #  Run unit tests.
        #
        karma:
            dev:
                configFile: "test/conf/karma-dev.js"
            ci:
                configFile: "test/conf/karma-ci.js"


        #  Remove old build.
        #
        clean:
            dist:
                src: "dist/"

        #  Copy the images and the index to the dist location.
        #
        copy:
            docs:
                files: [
                    { expand: true, cwd: "docs", src: ["**/*", "!technical/**"], dest: "dist/docs", dot: true }
                    { expand: true, cwd: "node_modules/baijs", src: "css/**/*", dest: "dist/docs" }
                    { expand: true, cwd: "node_modules/baijs", src: "js/**/*",  dest: "dist/docs" }
                    { expand: true, cwd: "lib",  src: "**/*", dest: "dist/docs/js" }
                ]

            examples:
                files: [
                    { expand: true, cwd: "examples", src: "**/*", dest: "dist/examples" }
                    { expand: true, cwd: "lib", src: "jquery.<%= pkg.name %>*", dest: "dist/examples/simple" }
                    { expand: true, cwd: "lib", src: "jquery.<%= pkg.name %>*", dest: "dist/examples/responsive" }
                    { expand: true, cwd: "lib", src: "jquery.<%= pkg.name %>*", dest: "dist/examples/infinite" }
                    { expand: true, cwd: "lib", src: "<%= pkg.name %>*", dest: "dist/examples/nojquery" }
                ]

        #  Generate technical documentation from code.
        #
        yuidoc:
            compile:
                name: '<%= pkg.name %>'
                description: '<%= pkg.description %>'
                version: '<%= pkg.version %>'
                url: '<%= pkg.homepage %>'
                options:
                    paths: 'lib/'
                    themedir: 'docs/technical/theme',
                    outdir: 'docs/technical/generated'

        #  Minify the javascript.
        #
        uglify:
            dist:
                options:
                    banner: "<%= banner %>"
                    beautify: false
                files: [
                    { src: "lib/jquery.<%= pkg.name %>.js", dest: "lib/jquery.<%= pkg.name %>.min.js" }
                    { src: "lib/<%= pkg.name %>.js", dest: "lib/<%= pkg.name %>.min.js" }
                ]


        #  Set paths and version.
        #
        processhtml:
            options:
                process: true
                strip: true
                environment: "dist"
                data:
                    version: "<%= pkg.version %>"
            html:
                files: [
                    { expand: true, src: "dist/docs/index.html" }
                    { expand: true, src: "dist/examples/**/*.html" }
                ]

        #  Make a zipfile from the dist and examples.
        #
        compress:
            docs:
                options:
                    archive: "dist/<%= pkg.name %>-<%= pkg.version %>-docs.zip"
                expand: true
                cwd: "dist/docs"
                src: "**/*"
                dest: "."

            examples :
                options :
                    archive: "dist/<%= pkg.name %>-<%= pkg.version %>.zip"
                expand : true
                cwd: "dist/examples"
                src: "**/*"
                dest: "."


        #  Deploy plugin to baijs.com
        #
        "ftp-deploy":
            docs:
                auth:
                    host: "ftp.baijs.nl"
                    port: 21
                    authKey: "<%= pkg.name %>"
                src: "dist/docs"
                dest: "/"

            examples:
                auth:
                    host: "ftp.baijs.nl"
                    port: 21
                    authKey: "<%= pkg.name %>"
                src: "dist/"
                dest: "/"
                exclusions: [
                    "docs"
                    "<%= pkg.name %>-<%= pkg.version %>-docs.zip"
                ]

    grunt.registerTask(
        "common"
        [
            "jshint"
            "copy:docs"
            "yuidoc"
            "uglify:dist"
            "copy:examples"
            "processhtml"
            "compress:docs"
            "compress:examples"
        ]
    )

    grunt.registerTask(
        "default"
        [
            "clean:dist"
            "karma:dev"
            "common"
        ]
    )

    grunt.registerTask(
        "ci"
        [
            "clean:dist"
            "karma:ci"
            "common"
        ]
    )

    grunt.registerTask(
        "ftp"
        [
            "default"
            "ftp-deploy:docs"
            "ftp-deploy:examples"
        ]
    )