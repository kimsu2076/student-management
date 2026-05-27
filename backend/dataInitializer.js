// 더미 데이터의 생성을 전담하는 모듈입니다.
const pool = require('./db'); // 데이터베이스 연결 풀 db.js를 가져옵니다.
const { faker } = require('@faker-js/faker'); // faker 라이브러리를 사용하여 가짜 데이터를 생성합니다.


function generateRandomStudent(index) {
    
    // 학번 생성
    const student_num = `2026${String(index).padStart(4, '0')}`; // 예: 20260001, 20260002, ...
    
    // 기본 인적사항 데이터 세팅
    const student_gender = faker.helpers.arrayElement(['M', 'F']);  // 성별을 무작위로 선택합니다.
    const grade = faker.helpers.arrayElement(['1급', '2급', '3급', '4급']); // 학년을 무작위로 선택합니다.

    // 생년월일: 1980년생부터 2010년생 사이 유학생 타겟팅
    const bdateObj = faker.date.birthdate({ min: new Date(1980, 0, 1), max: new Date(2010, 11, 31) });
    const student_bdate = bdateObj.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환합니다.
    }