const mysql = require('mysql2/promise');
// MySQL 데이터베이스 연결 설정

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', // Docker Compose에서 정의한 서비스 이름
  user: process.env.DB_USER || 'kopouser', // MySQL 사용자 이름
  password: process.env.DB_PASSWORD || 'koposuer', // MySQL 비밀번호
  database: process.env.DB_NAME || 'kopodb', // MySQL 데이터베이스 이름  
    waitForConnections: true,                // 연결 대기 설정
    connectionLimit: 10,                     // 최대 연결 수
    queueLimit: 0                            // 대기열 제한 (0은 무제한)
});

module.exports = pool;                      // 데이터베이스 연결 풀을 모듈로 내보냅니다.