pipeline {
agent any
 
environment {
 
    AWS_ACCOUNT_ID = '043784343117'
    AWS_REGION = 'us-east-2'
    IMAGE_NAME = '043784343117.dkr.ecr.us-east-2.amazonaws.com/quantitymeasurement-backend:v2'
 
    ECR_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${IMAGE_NAME}"
}
 
stages {
 
    stage('Checkout Code') {
 
        steps {
 
            git branch: 'dev-jenkins',
            url: 'https://github.com/Suhastg2004/QuantityMeasurementApp.git'
        }
    }
 
    stage('Build Docker Image') {
 
        steps {
 
            dir('quantitymeasurementapp_backend') {
 
                sh '''
                docker build -t quantitymeasurement-backend:latest .
                '''
            }
        }
    }
 
    stage('Login To ECR') {
 
        steps {
 
            withCredentials([[
                $class: 'AmazonWebServicesCredentialsBinding',
                credentialsId: 'aws-ecr-credential'
            ]]) {
 
                sh '''
                aws ecr get-login-password --region us-east-2 | \
                docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                '''
            }
        }
    }
 
    stage('Tag Docker Image') {
 
        steps {
 
            sh '''
            docker tag quantitymeasurement-backend:latest ${ECR_URI}:latest
            '''
        }
    }
 
    stage('Push Docker Image') {
 
        steps {
 
            sh '''
            docker push ${ECR_URI}:latest
            '''
        }
    }
 
    stage('Deploy To Application EC2') {
 
        steps {
 
            sh '''
            ssh -o StrictHostKeyChecking=no -i /var/lib/jenkins/.ssh/quantity-key.pem.pem ubuntu@52.15.139.167 << EOF
 
            aws ecr get-login-password --region us-east-2 | \
            docker login --username AWS --password-stdin ${ECR_URI}
 
            cd ~/QuantityMeasurementApp/quantitymeasurementapp_backend
 
            docker compose pull
 
            docker compose up -d
EOF
            '''
        }
    }
}
}
