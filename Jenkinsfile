#!groovy

node {
    stage('Install') {
        sh 'npm install && npm install grunt-cli -g'
    }

    stage('Build')
    	s:wqh 'grunt'
    }

    stage('Test'){
        sh 'grunt ci'
    }
}
