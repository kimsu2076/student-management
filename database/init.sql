-- 초기화: 기존 테이블이 존재한다면 삭제합니다.
DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS students;

-- 학생 정보 테이블을 생성합니다.
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY, -- 학생 고유 내부 ID
    student_num VARCHAR(20) NOT NULL UNIQUE, -- 학생 번호 (학번) (예: 20260001)
    student_name_en VARCHAR(100) NOT NULL, -- 학생 이름 (로마자. 예: Baatarsaikhan Naranjargal)
    student_name_kr VARCHAR(100) NOT NULL, -- 학생 이름 (한글 예: 박햇님)
    student_nationality VARCHAR(50) NOT NULL, -- 학생 국적 (예: 일본, 미국, 중국)
    student_gender ENUM('M', 'F') NOT NULL, -- 학생 성별 (M: 남성, F: 여성)
    student_bdate DATE NOT NULL, -- 학생 생년월일 (예: 2005-01-01)
    grade VARCHAR(20) NOT NULL -- 학생 학년 (예: 1학년, 2학년, 3학년)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 성적 정보 테이블을 생성합니다.
CREATE TABLE scores (
    score_id INT AUTO_INCREMENT PRIMARY KEY, -- 성적 고유 내부 ID
    student_id INT NOT NULL, -- 학생 ID (students 테이블의 student_id 참조)
    subject_name ENUM('어휘', '문법', '회화', '문학', '문화', '한국사') NOT NULL, -- 과목 이름 (고정)
    score INT NOT NULL CHECK (score between 0 AND 100), -- 점수 (0~100)
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE -- 학생이 삭제되면 해당 학생의 성적도 함께 삭제
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;    -- 초기 데이터 삽입 (예시)
