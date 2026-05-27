# Node.js 안정화 버전을 기본 이미지로 설정합니다.
FROM node:18

# 컨테이너 내부의 작업 디렉토리를 생성하고 이동합니다.
WORKDIR /app

# 패키지 의존성 파일을 복사합니다.
COPY package*.json ./

# 필요한 패키지들을 설치합니다.
RUN npm install

# 백엔드 소스코드 전체를 복사합니다.
COPY . .

# 3000번 포트를 외부에 노출합니다.
EXPOSE 3000

# package.json에 정의된 dev 스크립트(nodemon)를 실행합니다.
CMD ["npm", "run", "dev"]