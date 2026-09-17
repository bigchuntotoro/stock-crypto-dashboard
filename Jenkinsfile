pipeline {
    agent any

    tools {
        // Jenkins 관리에서 설정한 Tool 이름에 맞게 수정하세요 (예: JDK 21, Node 24)
        jdk 'Java21'
        nodejs 'Node24'
    }

    environment {
        PROJECT_DIR = '/home/totoro/Reactproject/stock-crypto-dashboard'
    }

    stages {
        stage('1. Git Checkout') {
            steps {
                checkout scm
            }
        }

        stage('2. Frontend Build') {
            steps {
                dir("${env.PROJECT_DIR}/frontend") {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('3. Backend Build (Jar)') {
            steps {
                dir("${env.PROJECT_DIR}") {
                    sh 'chmod +x gradlew'
                    sh './gradlew clean bootJar'
                }
            }
        }

        stage('4. Deploy & Restart') {
            steps {
                script {
                    // 1. 기존 동작 중인 Spring Boot 프로세스 종료 (8085 포트 기준)
                    sh '''
                        PID=$(lsof -t -i:8085)
                        if [ -n "$PID" ]; then
                            echo "Stopping existing Spring Boot application (PID: $PID)..."
                            kill -15 $PID
                            sleep 5
                        fi
                    '''

                    // 2. 로그 디렉토리 생성 확인
                    sh "mkdir -p ${env.PROJECT_DIR}/logs"

                    // 3. 백그라운드로 새 Jar 파일 실행 (nohup)
                    sh """
                        nohup java -jar ${env.PROJECT_DIR}/build/libs/*.jar > ${env.PROJECT_DIR}/logs/output.log 2>&1 &
                    """

                    // 4. Nginx 재시작 (프론트엔드 반영)
                    sh 'sudo systemctl reload nginx'
                }
            }
        }
    }

    post {
        success {
            echo '🎉 Build and Deployment completed successfully!'
        }
        failure {
            echo '❌ Build or Deployment failed. Please check the logs.'
        }
    }
}