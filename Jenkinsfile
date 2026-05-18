pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = '043784343117'
        AWS_REGION = 'us-east-2'

        IMAGE_NAME = 'quantitymeasurement-backend'
        IMAGE_TAG = 'v2'

        ECR_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${IMAGE_NAME}"

        EC2_USER = 'ubuntu'
        EC2_HOST = '52.15.139.167'
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
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login \
                    --username AWS \
                    --password-stdin \
                    ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    '''
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                sh '''
                docker tag quantitymeasurement-backend:latest \
                ${ECR_URI}:${IMAGE_TAG}
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                sh '''
                docker push ${ECR_URI}:${IMAGE_TAG}
                '''
            }
        }

        stage('Deploy To Application EC2') {
            steps {

                sh """
                ssh -o StrictHostKeyChecking=no \
                -i /var/lib/jenkins/.ssh/quantity-key.pem \
                ${EC2_USER}@${EC2_HOST} << EOF

                aws ecr get-login-password --region ${AWS_REGION} | \
                docker login \
                --username AWS \
                --password-stdin \
                ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

                cd ~/QuantityMeasurementApp/quantitymeasurementapp_backend

                docker compose down

                docker compose pull

                docker compose up -d

EOF
                """
            }
        }
    }
}
