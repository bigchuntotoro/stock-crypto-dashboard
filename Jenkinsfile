pipeline {
    agent any

    environment {
        // =================================================
        // 프로젝트 / 배포 경로 설정
        // =================================================
        TARGET_DIR      = '/home/totoro/Reactproject/stock-crypto-dashboard'
        APP_NAME        = 'stock-crypto-dashboard'
        SERVICE_NAME    = 'stock-crypto-dashboard'

        FRONTEND_DIR    = "${WORKSPACE}/frontend"
        STATIC_OUT_DIR  = "${WORKSPACE}/frontend/dist"

        // Nginx 정적 파일 루트 경로 (프론트엔드 포트 87 대응)
        NGINX_ROOT      = '/usr/share/nginx/html/stock-crypto-dashboard'

        // =================================================
        // 실행 환경 (Java 21, Node 24)
        // =================================================
        JAVA_HOME       = '/usr/lib/jvm/java-21-openjdk-amd64'
        APP_PORT        = '8085'

        PATH            = "/usr/local/bin:/usr/bin:/bin:${env.PATH}"
    }

    tools {
        jdk 'JDK21'
        nodejs 'NodeJS24'
    }

    stages {

        // =================================================
        // 1. 소스 체크아웃
        // =================================================
        stage('1. Checkout') {
            steps {
                checkout scm
                sh 'chmod +x gradlew'
            }
        }

        // =================================================
        // 2. React Frontend Build (Vite)
        // =================================================
        stage('2. Build Frontend (React - Vite)') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh """
                        set -e
                        echo "================================================="
                        echo "==> Checking Node / NPM"
                        echo "================================================="
                        node -v
                        npm -v

                        echo ""
                        echo "================================================="
                        echo "==> Installing NPM Dependencies"
                        echo "================================================="
                        if [ ! -d "node_modules" ]; then
                            npm ci --prefer-offline
                        else
                            npm ci --prefer-offline
                        fi

                        echo ""
                        echo "================================================="
                        echo "==> Building React Frontend"
                        echo "================================================="
                        npm run build
                    """
                }

                sh """
                    set -e
                    echo "================================================="
                    echo "==> Verifying Frontend Build Output Dir"
                    echo "================================================="
                    ls -lah "${STATIC_OUT_DIR}"
                """
            }
        }

        // =================================================
        // 3. Spring Boot Gradle Build (JAR 생성)
        // =================================================
        stage('3. Build Backend (Spring Boot / Gradle)') {
            steps {
                sh """
                    set -e
                    echo "================================================="
                    echo "==> Building Spring Boot Application with Gradle"
                    echo "================================================="

                    ./gradlew clean bootJar -x test

                    echo ""
                    echo "==> build/libs directory:"
                    ls -lah build/libs/
                """
            }
        }

        // =================================================
        // 4. Deploy Frontend to Nginx (Port 87)
        // =================================================
        stage('4. Deploy Frontend to Nginx') {
            steps {
                sh """
                    set -e
                    echo "================================================="
                    echo "==> Deploying React Frontend to Nginx"
                    echo "================================================="

                    sudo mkdir -p "${NGINX_ROOT}"

                    sudo rsync -av --delete \\
                        "${STATIC_OUT_DIR}/" \\
                        "${NGINX_ROOT}/"

                    sudo chown -R www-data:www-data "${NGINX_ROOT}"

                    sudo nginx -t
                    sudo systemctl reload nginx

                    echo "==> Frontend Deployment Completed"
                """
            }
        }

        // =================================================
        // 5. Deploy Backend JAR
        // =================================================
        stage('5. Deploy Backend JAR') {
            steps {
                sh """
                    set -e
                    echo "================================================="
                    echo "==> Preparing Spring Boot Deployment"
                    echo "================================================="

                    mkdir -p "${TARGET_DIR}"
                    mkdir -p "${TARGET_DIR}/logs"

                    BUILD_JAR=\$(find build/libs \\
                        -maxdepth 1 \\
                        -type f \\
                        -name "*.jar" \\
                        ! -name "*-sources.jar" \\
                        ! -name "*-plain.jar" \\
                        -print \\
                        | head -n 1)

                    if [ -z "\$BUILD_JAR" ]; then
                        echo "ERROR: Spring Boot JAR file not found."
                        exit 1
                    fi

                    echo "BUILD_JAR: \$BUILD_JAR"

                    cp -f "\$BUILD_JAR" "${TARGET_DIR}/${APP_NAME}.jar"
                    chmod 755 "${TARGET_DIR}/${APP_NAME}.jar"

                    echo "Deployment JAR: ${TARGET_DIR}/${APP_NAME}.jar"
                    ls -lah "${TARGET_DIR}/${APP_NAME}.jar"
                """
            }
        }

        // =================================================
        // 6. Run Spring Boot via systemd & Health/DB Check
        // =================================================
        stage('6. Run & Verify Application') {
            steps {
                sh """
                    set -e
                    echo "================================================="
                    echo "==> Restarting Spring Boot Service via systemd"
                    echo "================================================="

                    sudo systemctl daemon-reload
                    sudo systemctl restart ${SERVICE_NAME}

                    echo "==> Waiting for Spring Boot & DB connection..."
                    STARTED=false

                    for i in \$(seq 1 30); do
                        HTTP_CODE=\$(curl \\
                            -s \\
                            -o /dev/null \\
                            -w "%{http_code}" \\
                            --connect-timeout 1 \\
                            "http://127.0.0.1:${APP_PORT}/" \\
                            || true)

                        if [ "\$HTTP_CODE" != "000" ]; then
                            echo "Spring Boot responded with HTTP Status: \${HTTP_CODE}"
                            STARTED=true
                            break
                        fi

                        echo "--> Waiting for server response... \${i}/30"
                        sleep 1
                    done

                    if [ "\$STARTED" != "true" ]; then
                        echo "ERROR: Spring Boot failed to start. Checking systemd logs..."
                        sudo journalctl -u ${SERVICE_NAME} -n 50 --no-pager || true
                        exit 1
                    fi

                    echo "================================================="
                    echo "==> Verifying Database Connection via Logs"
                    echo "================================================="
                    RECENT_LOGS=\$(sudo journalctl -u ${SERVICE_NAME} -n 30 --no-pager)

                    if echo "\$RECENT_LOGS" | grep -E -i "HikariPool.*Exception|Communications link failure|Access denied|Connection refused"; then
                        echo "ERROR: Database connection error detected in logs!"
                        exit 1
                    else
                        echo "SUCCESS: No database connection errors found in recent logs."
                    fi

                    echo "================================================="
                    echo "==> Backend Deployment & DB Check Completed Successfully"
                    echo "================================================="
                """
            }
        }
    }

    // =====================================================
    // POST ACTIONS
    // =====================================================
    post {
        success {
            echo """
=================================================
Successfully deployed and verified ${APP_NAME}!
=================================================
Frontend Nginx Port : 87
Backend Application : ${APP_NAME}
Backend Port        : ${APP_PORT}
Logs Path           : ${TARGET_DIR}/logs/
=================================================
"""
        }

        failure {
            echo """
=================================================
Deployment or DB Check FAILED for ${APP_NAME}
=================================================
Check Jenkins console logs or systemd logs.
=================================================
"""
        }

        always {
            echo "==> Jenkins Pipeline Finished"
        }
    }
}