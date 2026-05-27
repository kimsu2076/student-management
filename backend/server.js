const express = require('express');
const path = require('path');
const pool = require('./db');
const { seedDatabase } = require('./dataInitializer');
    // Express 애플리케이션 초기화 및 미들웨어 설정


const app = express();
app.use(express.json());
    // 정적 파일 제공을 위해 'public' 디렉토리를 설정합니다. (예: 프론트엔드 빌드 결과물)

app.use(express.static(path.join(__dirname, 'public')));
    // 학생 데이터와 성적을 포함한 API 엔드포인트를 정의합니다. (CRUD 기능 포함)

function calculateGradeFromPercentRank(pRank) {
    const percentage = pRank * 100; // 0 ~ 100 사이의 상위 비율로 변환
    if (percentage <= 4) return '1등급';
    if (percentage <= 11) return '2등급';
    if (percentage <= 23) return '3등급';
    if (percentage <= 40) return '4등급';
    if (percentage <= 60) return '5등급';
    if (percentage <= 77) return '6등급';
    if (percentage <= 89) return '7등급';
    if (percentage <= 96) return '8등급';
    return '9등급';
        // PERCENT_RANK()로 계산된 상위 백분위 비율을 한국의 9등급 체계로 변환하는 함수입니다.
}

app.get('/api/students', async (req, res) => {
    try {
        // PERCENT_RANK()를 통해 과목별로 다른 학생들과 비교한 위치(상위 백분위 비율)를 실시간 계산해 옵니다.
        const query = `
            SELECT 
                s.student_id, s.student_num, s.student_name_kr, s.student_name_en, 
                s.student_nationality, s.student_gender, s.student_bdate, s.grade as korean_level,
                sc.subject_name, sc.score,
                PERCENT_RANK() OVER (PARTITION BY sc.subject_name ORDER BY sc.score DESC) as p_rank
            FROM students s
            JOIN scores sc ON s.student_id = sc.student_id
            ORDER BY s.student_id ASC, sc.score DESC;
        `;
            // 학생과 과목별 점수, 그리고 해당 점수가 과목 내에서 어느 정도 위치에 있는지를 나타내는 PERCENT_RANK() 결과를 함께 가져오는 SQL 쿼리입니다.
            // 학생별로 과목 점수와 백분위 순위를 계산하여 프론트엔드에서 강점과 약점 과목을 분석할 수 있도록 데이터를 구조화합니다.
        
        const [rows] = await pool.query(query);
            // SQL 쿼리를 실행하여 학생과 과목별 점수, 그리고 백분위 순위를 포함한 결과를 가져옵니다.
        
        // 로우 데이터를 학생 단위 데이터 구조로 체계적으로 묶어줍니다 (Grouping)
        const studentsMap = {};
        rows.forEach(row => {   // 각 로우는 학생과 과목별 점수, 그리고 백분위 순위를 포함하고 있습니다. 
                                // 학생 ID를 기준으로 데이터를 그룹화하여 학생별로 과목 점수와 백분위 순위를 배열로 묶어줍니다.
            if (!studentsMap[row.student_id]) {
                studentsMap[row.student_id] = {
                    student_id: row.student_id,
                    student_num: row.student_num,
                    student_name_kr: row.student_name_kr,
                    student_name_en: row.student_name_en,
                    student_nationality: row.student_nationality,
                    student_gender: row.student_gender,
                    student_bdate: row.student_bdate.toISOString().split('T')[0],
                    korean_level: row.korean_level,
                    subjects: [],
                        // 과목별 점수와 백분위 순위를 담을 배열입니다.
                    totalScore: 0
                        // 학생의 총점 계산을 위한 초기값입니다. 나중에 평균 계산에 활용됩니다.
                };
            }
            
            const gradeStr = calculateGradeFromPercentRank(row.p_rank);
                // PERCENT_RANK()로 계산된 상위 백분위 비율을 한국의 9등급 체계로 변환하여 저장합니다.
            studentsMap[row.student_id].subjects.push({
                subject_name: row.subject_name,
                score: row.score,
                percent_rank: row.p_rank,
                grade: gradeStr
            });
                // 학생의 과목별 점수와 백분위 순위를 subjects 배열에 추가합니다.
            studentsMap[row.student_id].totalScore += row.score;
                // 학생의 총점에 현재 과목 점수를 누적하여 저장합니다. 나중에 평균 계산에 활용됩니다.
        });

        const studentsList = Object.values(studentsMap);
        // 학생별로 과목 점수와 백분위 순위를 포함한 데이터를 리스트 형태로 변환합니다. 
        // 이후 각 학생별로 평균 점수, 강점 과목, 약점 과목을 분석하여 추가 정보를 세팅합니다.

        // 각 학생별로 평균, 강점 과목, 약점 과목을 정밀 분석하여 세팅합니다.
        studentsList.forEach(student => {
            student.average = Number((student.totalScore / student.subjects.length).toFixed(2));
            
            // 점수순 정렬 (이미 쿼리에서 DESC 정렬되어 넘어왔음)
            const sorted = [...student.subjects].sort((a, b) => b.score - a.score);
            
            // 강점 과목 추출 (공동 1등 고려 최대 2개)
            student.strengths = sorted.slice(0, 2).map(s => `${s.subject_name}(${s.score}점, ${s.grade})`);
            
            // 약점 과목 추출 (공동 꼴찌 고려 하위 2개)
            student.weaknesses = sorted.slice(-2).reverse().map(s => `${s.subject_name}(${s.score}점, ${s.grade})`);
        });

        res.json(studentsList); // 최종적으로 학생별로 과목 점수, 백분위 순위, 평균 점수, 강점 과목, 약점 과목이 포함된 데이터를 JSON 형태로 응답합니다.
    } catch (err) { 
        console.error(err);
        res.status(500).json({ error: '앗... 서버 에러가 발생했습니다!' });
    }
        // 학생 데이터와 과목별 점수, 그리고 백분위 순위를 포함한 데이터를 학생 단위로 그룹화하여 프론트엔드에 전달하는 API 엔드포인트입니다.
});

app.post('/api/students', async (req, res) => { // 학생 등록을 위한 POST API 엔드포인트입니다.
    const { student_num, student_name_kr, student_name_en, student_nationality, student_gender, student_bdate, korean_level, scores } = req.body;
        // 요청 본문에서 학생의 기본 정보와 과목별 점수를 추출합니다. scores는 { "어휘": 85, "문법": 90, ... } 형태로 전달됩니다.

    const conn = await pool.getConnection();    // 데이터베이스 연결을 가져옵니다. 트랜잭션 처리를 위해 별도의 연결을 사용합니다.
    try {
        await conn.beginTransaction(); // 트랜잭션 수립
        
        // 학생 메인 정보 저장
        const [studentResult] = await conn.query(
            `INSERT INTO students (student_num, student_name_kr, student_name_en, student_nationality, student_gender, student_bdate, grade)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [student_num, student_name_kr, student_name_en, student_nationality, student_gender, student_bdate, korean_level]
        );
        
        const studentId = studentResult.insertId;
        
        // 6개 과목 성적 일괄 삽입
        const subjects = ['어휘', '문법', '회화', '문학', '문화', '한국사'];
        for (const sub of subjects) {
            const scoreVal = scores[sub] || 0;
            await conn.query(
                `INSERT INTO scores (student_id, subject_name, score) VALUES (?, ?, ?)`,
                [studentId, sub, scoreVal]
            );
        }
        
        await conn.commit();
        res.status(201).json({ message: '성공적으로 등록되었습니다.' });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ error: '데이터 형식을 확인해 주세요!' });
    } finally {
        conn.release();
    }
});

app.put('/api/students/:id', async (req, res) => {
        // 학생 정보 수정을 위한 PUT API 엔드포인트입니다. 
        // URL 경로에서 학생 ID를 추출하여 해당 학생의 정보를 업데이트합니다.
    const { id } = req.params;
    const { student_name_kr, student_name_en, student_nationality, scores } = req.body;
        // 요청 본문에서 수정할 학생의 이름과 국적, 그리고 과목별 점수를 추출합니다.
        // scores는 { "어휘": 85, "문법": 90, ... } 형태로 전달됩니다.
    
    const conn = await pool.getConnection();
        // 데이터베이스 연결을 가져옵니다. 트랜잭션 처리를 위해 별도의 연결을 사용합니다.
    try {
        await conn.beginTransaction();
            // 트랜잭션 수립하여 학생 정보와 과목별 점수 업데이트를 원자적으로 처리합니다.
        
        // 인적 사항 업데이트
        await conn.query(
            `UPDATE students SET student_name_kr = ?, student_name_en = ?, student_nationality = ? WHERE student_id = ?`,
            [student_name_kr, student_name_en, student_nationality, id]
        );
        
        // 요청받은 과목 점수 업데이트
        if (scores) {
            for (const [subject, score] of Object.entries(scores)) {
                await conn.query(
                    `UPDATE scores SET score = ? WHERE student_id = ? AND subject_name = ?`,
                    [score, id, subject]
                );
            }
        }
        
        // 모든 업데이트가 성공적으로 완료되면 트랜잭션을 커밋하여 변경사항을 확정합니다.
        await conn.commit();

        // 업데이트가 성공적으로 완료되면 클라이언트에 성공 메시지를 응답합니다.
        res.json({ message: '수정이 완료되었습니다!' });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ error: '아차차, 수정에 실패했습니다!' });
    } finally {
        conn.release();
    }
});

    // 학생 삭제를 위한 DELETE API 엔드포인트입니다.
    // URL 경로에서 학생 ID를 추출하여 해당 학생의 정보를 삭제합니다.
app.delete('/api/students/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM students WHERE student_id = ?', [req.params.id]);
        res.json({ message: '삭제 처리가 무사히 끝났습니다!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '삭제 실패' });
    }
});

// 서버 기동 시 임베디드 데이터베이스 초기화 함수를 호출하고 리스닝을 시작합니다.
const PORT = 3000;
app.listen(PORT, async () => {
    console.log(`서버가 성공적으로 실행되었습니다: http://localhost:${PORT}`);
    await seedDatabase(); // 가짜 데이터 주입 함수 실행
});