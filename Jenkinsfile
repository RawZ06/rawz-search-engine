    stages {
        stage('Build') {
            steps {
                sh 'docker build .'
                sh 'docker build . -t rawz-seach-engine'
            }
        }
        stage('Deploy') {
            steps {
                sh 'cd /home/system/projects/rawz-seach-engine && docker-compose up -d'
            }
        }
    }
