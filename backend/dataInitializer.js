// 더미 데이터의 생성을 전담하는 모듈입니다.
const pool = require('./db'); // 데이터베이스 연결 풀 db.js를 가져옵니다.
const { faker } = require('@faker-js/faker'); // faker 라이브러리를 사용하여 가짜 데이터를 생성합니다.

// 문화권별 이름 데이터를 정의합니다. 각 문화권마다 성과 이름을 영어와 한국어로 제공합니다.
const culturalGlobalData = {
    '미국': {
        isWestern: true,
        lastNames: [
            { en: 'Smith', kr: '스미스' }, { en: 'Johnson', kr: '존슨' }, { en: 'Williams', kr: '윌리엄스' },
            { en: 'Brown', kr: '브라운' }, { en: 'Jones', kr: '존스' }, { en: 'Miller', kr: '밀러' },
            { en: 'Davis', kr: '데이비스' }, { en: 'Wilson', kr: '윌슨' }, { en: 'Anderson', kr: '앤더슨' },
            { en: 'Taylor', kr: '테일러' }
        ],
        firstNames: {
            M: [
                { en: 'John', kr: '존' }, { en: 'Michael', kr: '마이클' }, { en: 'David', kr: '데이비드' },
                { en: 'James', kr: '제임스' }, { en: 'Robert', kr: '로버트' }
            ],
            F: [
                { en: 'Mary', kr: '메리' }, { en: 'Patricia', kr: '패트리샤' }, { en: 'Jennifer', kr: '제니퍼' },
                { en: 'Linda', kr: '린다' }, { en: 'Elizabeth', kr: '엘리자베스' }
            ]
        }
    },
    '일본': {
        isWestern: false,
        lastNames: [
            { en: 'Sato', kr: '사토' }, { en: 'Suzuki', kr: '스즈키' }, { en: 'Takahashi', kr: '타카하시' },
            { en: 'Tanaka', kr: '타나카' }, { en: 'Watanabe', kr: '와타나베' }
        ],
        firstNames: {
            M: [
                { en: 'Hiroshi', kr: '히로시' }, { en: 'Kenji', kr: '켄지' }, { en: 'Takuya', kr: '타쿠야' },
                { en: 'Haruto', kr: '하루토' }, { en: 'Yuto', kr: '유토' }
            ],
            F: [
                { en: 'Mayu', kr: '마유' }, { en: 'Yuki', kr: '유키' }, { en: 'Sakura', kr: '사쿠라' },
                { en: 'Aoi', kr: '아오이' }, { en: 'Hina', kr: '히나' }
            ]
        }
    },
    '중국': {
        isWestern: false,
        lastNames: [
            { en: 'Wang', kr: '왕' }, { en: 'Li', kr: '리' }, { en: 'Zhang', kr: '장' },
            { en: 'Liu', kr: '류' }, { en: 'Chen', kr: '첸' }
        ],
        firstNames: {
            M: [
                { en: 'Wei', kr: '웨이' }, { en: 'Jian', kr: '지안' }, { en: 'Lei', kr: '레이' },
                { en: 'Hao', kr: '하오' }, { en: 'Jun', kr: '준' }
            ],
            F: [
                { en: 'Min', kr: '민' }, { en: 'Fang', kr: '팡' }, { en: 'Xiuying', kr: '슈잉' },
                { en: 'Mei', kr: '메이' }, { en: 'Ying', kr: '잉' }
            ]
        }
    },
    '베트남': {
        isWestern: false,
        lastNames: [
            { en: 'Nguyen', kr: '응우옌' }, { en: 'Tran', kr: '쩐' }, { en: 'Le', kr: '레' },
            { en: 'Pham', kr: '팜' }, { en: 'Hoang', kr: '호앙' }
        ],
        firstNames: {
            M: [
                { en: 'Van Hung', kr: '반 훙' }, { en: 'Duc Anh', kr: '득 아인' }, { en: 'Quang Huy', kr: '쾅 후이' },
                { en: 'Tuan Anh', kr: '투안 아인' }, { en: 'Duy Manh', kr: '두이 마인' }
            ],
            F: [
                { en: 'Thi Mai', kr: '티 마이' }, { en: 'Minh Tu', kr: '민 투' }, { en: 'Hai Yen', kr: '하이 옌' },
                { en: 'Thanh Ha', kr: '타인 하' }, { en: 'Thu Trang', kr: '투 짱' }
            ]
        }
    },
    '러시아': {
        isWestern: true,
        lastNames: {
            M: [
                { en: 'Ivanov', kr: '이바노프' }, { en: 'Smirnov', kr: '스미르노프' }, { en: 'Petrov', kr: '페트로프' },
                { en: 'Kuznetsov', kr: '쿠즈네초프' }, { en: 'Popov', kr: '포포프' }
            ],
            F: [
                { en: 'Ivanova', kr: '이바노바' }, { en: 'Smirnova', kr: '스미르노바' }, { en: 'Petrova', kr: '페트로바' },
                { en: 'Kuznetsova', kr: '쿠즈네초바' }, { en: 'Popova', kr: '포포바' }
            ]
        },
        firstNames: {
            M: [
                { en: 'Aleksandr', kr: '알렉산드르' }, { en: 'Sergey', kr: '세르게이' }, { en: 'Vladimir', kr: '블라디미르' },
                { en: 'Dmitry', kr: '드미트리' }, { en: 'Ivan', kr: '이반' }
            ],
            F: [
                { en: 'Elena', kr: '엘레나' }, { en: 'Olga', kr: '올가' }, { en: 'Anna', kr: '안나' },
                { en: 'Tatiana', kr: '타티아나' }, { en: 'Maria', kr: '마리아' }
            ]
        }
    },
    '프랑스': {
        isWestern: true,
        lastNames: [
            { en: 'Martin', kr: '마르탱' }, { en: 'Bernard', kr: '베르나르' }, { en: 'Thomas', kr: '토마' },
            { en: 'Petit', kr: '프티' }, { en: 'Durand', kr: '뒤랑' }
        ],
        firstNames: {
            M: [
                { en: 'Jean', kr: '장' }, { en: 'Pierre', kr: '피에르' }, { en: 'Michel', kr: '미셸' },
                { en: 'Lucas', kr: '뤼카' }, { en: 'Louis', kr: '루이' }
            ],
            F: [
                { en: 'Marie', kr: '마리' }, { en: 'Nathalie', kr: '나탈리' }, { en: 'Isabelle', kr: '이자벨' },
                { en: 'Emma', kr: '에마' }, { en: 'Chloé', kr: '클로에' }
            ]
        }
    },
    '인도네시아': {
        isWestern: true, // [이름] [두번째 이름] 구조로 자연스럽게 공백이 생기도록 처리
        lastNames: [
            { en: 'Wijaya', kr: '위자야' }, { en: 'Saputra', kr: '사푸트라' }, { en: 'Hidayat', kr: '히다얏' },
            { en: 'Kurniawan', kr: '쿠르니아완' }, { en: 'Pratama', kr: '프라타마' }
        ],
        firstNames: {
            M: [
                { en: 'Ahmat', kr: '아흐맛' }, { en: 'Mohamat', kr: '모하맛' }, { en: 'Budi', kr: '부디' },
                { en: 'Agus', kr: '아구스' }, { en: 'Hendra', kr: '헨드라' }
            ],
            F: [
                { en: 'Siti', kr: '시티' }, { en: 'Putri', kr: '푸트리' }, { en: 'Dewi', kr: '데위' },
                { en: 'Indah', kr: '인다' }, { en: 'Lestari', kr: '레스타리' }
            ]
    }
    }
};

// scores 테이블에서 허용하는 정해진 과목 상수 배열입니다.
const subjects = ['어휘', '문법', '회화', '문학', '문화', '한국사'];

function generateRandomStudent(index) {
    
    // 학번 생성
    const student_num = `2026${String(index).padStart(4, '0')}`; // 예: 20260001, 20260002, ...
    
    // 기본 인적사항 데이터 세팅
    const student_gender = faker.helpers.arrayElement(['M', 'F']);  // 성별을 무작위로 선택합니다.
    const grade = faker.helpers.arrayElement(['1급', '2급', '3급', '4급']); // 학년을 무작위로 선택합니다.

    // 생년월일: 1980년생부터 2010년생 사이 유학생 타겟팅
    const bdateObj = faker.date.birthdate({ min: new Date(1980, 1, 1), max: new Date(2010, 12, 31) });
    const student_bdate = bdateObj.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환합니다.
    

    // 문화권과 국적을 무작위로 선택하여 이름 생성에 활용합니다.
    const nationsList = Object.keys(culturalGlobalData);
    const student_nationality = faker.helpers.arrayElement(nationsList);
    const nationPool = culturalGlobalData[student_nationality];

    // 성별과 문화권에 따라 이름을 무작위로 선택합니다.
    const firstNameObj = faker.helpers.arrayElement(nationPool.firstNames[student_gender]);

    // 성씨(LastName) 추출 - 러시아 분기 로직 원천 유지
    let lastNameObj;
    if (Array.isArray(nationPool.lastNames)) {
        lastNameObj = faker.helpers.arrayElement(nationPool.lastNames);
    } else {
        lastNameObj = faker.helpers.arrayElement(nationPool.lastNames[student_gender]);
    }

    let student_name_en = '';
    let student_name_kr = '';

    // 문화권 정렬법 세팅
    if (nationPool.isWestern) {
        // 서양권 및 인도네시아: [이름] [성/두번째이름]
        student_name_en = `${firstNameObj.en} ${lastNameObj.en}`;
        student_name_kr = `${firstNameObj.kr} ${lastNameObj.kr}`;
    } else {
        // 동양권(중국/일본/베트남): [성][이름]
        student_name_en = `${lastNameObj.en} ${firstNameObj.en}`;
        student_name_kr = `${lastNameObj.kr}${firstNameObj.kr}`;
    }

    return {
        student_num,
        student_name_en,
        student_name_kr,
        student_nationality,
        student_gender,
        student_bdate,
        grade
    };
    // 반환된 객체는 학생의 학번, 영어 이름, 한국어 이름, 국적, 성별, 생년월일, 학년 정보를 포함합니다.
}

async function seedDatabase() {
    let conn;
    try {
        conn = await pool.getConnection();

        const [rows] = await conn.query('SELECT COUNT(*) as count FROM students');
        if (rows[0].count > 0) {
            console.log('데이터베이스에 이미 데이터가 존재하므로 초기화를 건너뜁니다.');
            return;
        }

        console.log('학생 데이터 시딩을 기동합니다...');

        // 60명의 학생 데이터를 생성하여 데이터베이스에 삽입합니다.
        for (let i = 1; i <= 60; i++) {
            const student = generateRandomStudent(i);
            // students 테이블에 학생 데이터를 삽입합니다.

            const [studentResult] = await conn.query(   // SQL 쿼리를 사용하여 학생 데이터를 삽입합니다. ? 플레이스홀더를 사용하여 안전하게 값을 전달합니다.
                `INSERT INTO students (student_num, student_name_en, student_name_kr, student_nationality, student_gender, student_bdate, grade)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`, // SQL 쿼리에서 ?는 각각의 값이 들어갈 자리입니다. 이는 SQL 인젝션 공격을 방지하는 안전한 방법입니다.
                [
                    student.student_num, student.student_name_en, student.student_name_kr,  
                    // 학생의 학번, 영어 이름, 한국어 이름, 국적, 성별, 생년월일, 학년 정보를 각각의 플레이스홀더에 전달합니다.
                    student.student_nationality, student.student_gender, student.student_bdate, student.grade
                    // 학생 객체에서 필요한 정보를 추출하여 배열로 전달합니다. 이 배열의 순서는 SQL 쿼리의 플레이스홀더 순서와 일치해야 합니다.
                ]
            );
            
            // 삽입된 학생의 ID를 가져옵니다. 이 ID는 scores 테이블에 점수를 삽입할 때 사용됩니다.
            const insertedStudentId = studentResult.insertId;

            // 각 학생마다 6과목에 대한 점수를 랜덤으로 생성하여 scores 테이블에 삽입합니다.
            for (const subject of subjects) {   // subjects 배열에 정의된 각 과목에 대해 점수를 생성합니다.
                const score = faker.number.int({ min: 30, max: 100 });  // 30점에서 100점 사이의 랜덤한 정수 점수를 생성합니다.
                await conn.query(   // SQL 쿼리를 사용하여 scores 테이블에 점수를 삽입합니다.
                    `INSERT INTO scores (student_id, subject_name, score) VALUES (?, ?, ?)`,
                        // SQL 쿼리에서 ?는 각각의 값이 들어갈 자리입니다. 학생 ID, 과목 이름, 점수를 안전하게 전달합니다.
                    [insertedStudentId, subject, score]
                    // 학생 ID, 과목 이름, 점수를 배열로 전달합니다. 이 배열의 순서는 SQL 쿼리의 플레이스홀더 순서와 일치해야 합니다.
                );
            }
        }

        console.log('학생 데이터 시딩이 완료되었습니다.');
    } catch (error) {
        console.error('데이터 시딩 중 오류가 발생했습니다:', error);
    }
    finally {
        if (conn) conn.release(); // 데이터베이스 연결을 해제하여 풀로 반환합니다.
    }
}

module.exports = { seedDatabase }; 
// 시딩 함수를 모듈로 내보냅니다. 다른 파일에서 이 함수를 호출하여 데이터베이스를 초기화할 수 있습니다.