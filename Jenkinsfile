#!groovy

node {
    stage('install dependencies') {
        npm install
        npm install grunt
        npm install grunt-cli -g
    }

    stage('build app')
        grunt
    }

    stage('test'){
        grunt ci
    }
}
