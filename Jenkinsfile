pipeline {
    agent any
    
    stages {
        stage('Build docker') {
            steps {
                script {
                    docker.withRegistry('', 'dockerhub') {
                        def imageName = "rawz-search-engine:latest"
                        def dockerfile = "Dockerfile"
                        
                        docker.build(imageName, "-f ${dockerfile} .")
                        docker.image(imageName).push()
                    }
                }
            }
        }
        stage('Restart container') {
            steps {
                script {
                    sshagent(['SSH remote']) {
                        sh 'ssh alexandre@devops.alexandre-longordo.fr "cd /home/alexandre/system-container/projects/rawz-search-engine && docker-compose up -d"'
                    }
                }
            }
        }
    }
}
