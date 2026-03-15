1️⃣ Comandos docks

// SUBINDO CONTAINER

# docker-compose up -d

// PARANDO O CONTAINER

# docker-compose down -v

// LISTANDO OS CONTAINERS

# docker ps -a

// REMOVENDO CONTAINERS

# docker rm -f -id--container

//LISTANDO AS IMAGENS

# docker image ls

//REMOVENDO AS IMAGENS

# docker rmi --id--imagem

2️⃣ Testes automatizados com jest

# npm install --save-dev jest

# npm install --save-dev ts-jest @types/jest

# npx ts-jest config:init

module.exports = {
preset: "ts-jest",
testEnvironment: "node",
};

"scripts": {
"test": "jest"
"test:dev": "jest --watch"
}

3️⃣ Testar um arquivo específico

# npx jest src/tests/users-controller.test.ts

4️⃣ Buildando projeto

# npm install tsup@8.3.0 -D

"build": "tsup dis",
"start": "node --env-file=.env dist/server.js"

"engines": {
"node": ">=18"
}
