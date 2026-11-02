pipeline {
    agent any
    options {
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        FRONTEND_DIR = '/despliegue/vesta/Frontend'
        BACKEND_DIR = '/despliegue/vesta/Vesta'

        DEPLOY_DIR = '/despliegue/vesta/despliegue'
        BACKUP_DIR = '/despliegue/vesta/Backups'

        // Servidor remoto
        REMOTE_DIR = '/opt/docker/vesta'
        SSH_PORT = '22'
        SSH_CREDENTIALS = 'vps-ssh-key'

        COMPOSE_FILE = 'compose.yml'
    }

    stages {
        stage('Compilar Frontend') {
            steps {
                dir("$FRONTEND_DIR") {
                    withCredentials([
                        file(
                            credentialsId: '.env-frontend-vesta',
                            variable: 'FRONTEND_ENV'
                        )
                    ]) {
                        sh '''
                        cp "$FRONTEND_ENV" .env
                        npm ci
                        npm run build

                        test -f dist/index.html
                    '''
                    }
                }
            }
        }

        stage('Preparar despliegue') {
            steps {
                sh '''
                    rm -rf -- "$DEPLOY_DIR"

                    mkdir -p  "$DEPLOY_DIR/frontend"

                    cp -a "$BACKEND_DIR/." "$DEPLOY_DIR"
                    cp -a "$FRONTEND_DIR/dist/." "$DEPLOY_DIR/frontend"

                    echo "Contenido del despliegue:"
                    ls -la "$DEPLOY_DIR"
                '''
            }
        }

        stage('Backup'){
            steps{
                withCredentials([
                        sshUserPrivateKey(
                            credentialsId: 'deploy',
                            keyFileVariable: 'SSH_KEY',
                            usernameVariable: 'SSH_USER'
                        ),
                        string(
                            credentialsId: 'servidor-vps',
                            variable: 'SSH_HOST'
                        )
                    ]){
                        sh '''
                            set -eu

                            BACKUP_DATE=$(TZ=America/Argentina/Buenos_Aires date +%Y_%m_%d)

                            mkdir -p "$BACKUP_DIR/$BACKUP_DATE"

                            rsync -avz \
                                -e "ssh -i $SSH_KEY \
                                    -o IdentitiesOnly=yes \
                                    -o StrictHostKeyChecking=yes \
                                    -p $SSH_PORT" \
                                "$SSH_USER@$SSH_HOST:$REMOTE_DIR/" \
                                "$BACKUP_DIR/$BACKUP_DATE/"

                            echo "Backup local creado: $BACKUP_DIR/$BACKUP_DATE"
                        '''
                }
            }
        }

        stage('Transferir al VPS') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'deploy',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    ),
                    string(
                        credentialsId: 'servidor-vps',
                        variable: 'SSH_HOST'
                    ),
                    file(
                        credentialsId: '.env-backend-vesta',
                        variable: 'BACKEND_ENV'
                    )
                ]) {
                    sh '''
                        set -eu

                        rsync -avz \
                        --exclude='.env' \
                        --exclude='.env.example' \
                        --exclude='compose-dev.yaml' \
                        --exclude='vendor/' \
                        -e "ssh -i $SSH_KEY \
                            -o IdentitiesOnly=yes \
                            -o StrictHostKeyChecking=yes \
                            -p $SSH_PORT" \
                        "$DEPLOY_DIR/" \
                        "$SSH_USER@$SSH_HOST:$REMOTE_DIR/"

                        rsync -avz \
                        --chmod=F600 \
                        -e "ssh -i $SSH_KEY \
                            -o IdentitiesOnly=yes \
                            -o StrictHostKeyChecking=yes \
                            -p $SSH_PORT" \
                        "$BACKEND_ENV" \
                        "$SSH_USER@$SSH_HOST:$REMOTE_DIR/.env"

                    '''
                }
            }
        }


        stage('Despliegue con Docker Compose'){
            steps{
                withCredentials([
                        sshUserPrivateKey(
                            credentialsId: 'deploy',
                            keyFileVariable: 'SSH_KEY',
                            usernameVariable: 'SSH_USER'
                        ),
                        string(
                            credentialsId: 'servidor-vps',
                            variable: 'SSH_HOST'
                        )
                    ]) {
                        sh '''
                            set -eu

                            ssh -i "$SSH_KEY" \
                                -o IdentitiesOnly=yes \
                                -o StrictHostKeyChecking=yes \
                                -p "$SSH_PORT" \
                                "$SSH_USER@$SSH_HOST" \
                                "set -eu
                                cd '$REMOTE_DIR'
                                docker compose config --quiet
                                docker compose up -d --build --remove-orphans
                                docker compose ps"
                        '''
                    }
            }
        }
    }

    post {
        success {
            echo 'Despliegue completado correctamente'
        }

        failure {
            echo 'Falló el pipeline de despliegue'
        }
    }

}
