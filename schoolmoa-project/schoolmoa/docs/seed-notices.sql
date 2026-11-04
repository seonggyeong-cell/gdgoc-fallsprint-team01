-- [담당: 역할 A] mockNotices 및 inhaSampleNotices의 Supabase notices 테이블 초기 데이터 이관 SQL
-- Supabase SQL Editor에서 실행하시면 기본 공고 데이터가 notices 테이블에 등록됩니다.

INSERT INTO public.notices (
  id, title, category, subcategory, organizer, source, official_url,
  benefit, estimated_value_number, start_date, deadline, is_ongoing,
  summary, description, tags, career_fields, majors, views, bookmarked_count, is_user_submitted
) VALUES
('work-01', '2학기 교내 근로장학생 추가 모집 (도서관·행정부서)', 'work', '교내 근로장학', '학생지원팀', 'inha', 'https://www.inha.ac.kr',
 '시급 11,000원 + 근로장학금', 900000, CURRENT_DATE - 2, CURRENT_DATE + 6, false,
 '교내 부서에서 근무하며 학비 부담을 줄일 수 있는 근로장학생을 추가로 모집합니다.', '', '{"근로장학","교내","학비지원"}', '{}', '{}', 1420, 210, false),

('work-02', '학과 연구실 학부 연구보조원(RA) 모집', 'work', '교내 행정·연구 보조', '공과대학 연구실', 'inha', 'https://www.inha.ac.kr',
 '월 40만원 + 연구 경험', 2400000, CURRENT_DATE - 3, CURRENT_DATE + 14, false,
 '데이터 정리와 실험 보조 업무를 맡을 학부 연구보조원을 모집합니다.', '', '{"연구보조","RA","대학원진학"}', '{"science","engineering"}', '{"화학","물리","전기","기계","신소재"}', 540, 66, false),

('work-03', '재택 가능 데이터 라벨링·검수 단기 알바', 'work', '재택·단기 알바', '데이터 서비스 업체', 'albamon', 'https://www.albamon.com',
 '건당 보수 / 주 10시간 내외', 400000, CURRENT_DATE - 3, CURRENT_DATE + 365, true,
 '시간 조율이 쉬운 재택 단기 알바로 방학·시험 기간에도 병행할 수 있습니다.', '', '{"재택","단기알바","데이터"}', '{"ai"}', '{}', 880, 95, false),

('career-01', '국내 IT 기업 개발자 체험형 인턴 채용', 'career', '인턴십', 'IT 서비스 기업', 'jobkorea', 'https://www.jobkorea.co.kr',
 '월 220만원 + 정규직 전환 심사', 4400000, CURRENT_DATE - 4, CURRENT_DATE + 9, false,
 '백엔드·프론트엔드·모바일 직무 인턴을 모집하며 우수자는 정규직 전환 기회가 있습니다.', '', '{"인턴","개발자","정규직전환"}', '{"software","ai"}', '{"컴퓨터","정보통신","소프트웨어","인공지능","데이터"}', 3200, 520, false),

('career-02', '대기업 계열사 대학생 하계·동계 인턴 공개채용', 'career', '인턴십', '대기업 계열사', 'saramin', 'https://www.saramin.co.kr',
 '인턴 급여 + 우수자 서류전형 면제', 3500000, CURRENT_DATE - 3, CURRENT_DATE + 18, false,
 '직무별 현업 체험과 수료 후 채용 연계 혜택이 제공됩니다.', '', '{"대기업","인턴","채용연계"}', '{"business","engineering"}', '{}', 2750, 430, false),

('career-03', '스타트업 마케팅·기획 인턴 (주 3일 근무 가능)', 'career', '인턴십', '초기 스타트업', 'linkareer', 'https://linkareer.com',
 '월 120만원 + 실무 포트폴리오', 1200000, CURRENT_DATE - 3, CURRENT_DATE + 12, false,
 '학업과 병행 가능한 파트타임 인턴으로 콘텐츠 기획과 마케팅 실무를 경험합니다.', '', '{"스타트업","마케팅","파트타임"}', '{"business","design"}', '{"경영","통상","디자인"}', 960, 120, false),

('career-04', '재학생 현장실습(학기제) 참여 학생 모집', 'career', '현장실습', '현장실습지원센터', 'inha', 'https://www.inha.ac.kr',
 '학점 인정 + 실습 지원비', 1500000, CURRENT_DATE - 3, CURRENT_DATE + 21, false,
 '학기 중 협력 기업에서 실습하며 학점도 인정받는 프로그램입니다.', '', '{"현장실습","학점인정","산학"}', '{"engineering","software"}', '{}', 700, 88, false),

('sch-01', '국가장학금 2차 신청 안내', 'scholarship', '소득연계', '한국장학재단', 'kosaf', 'https://www.kosaf.go.kr',
 '소득구간별 등록금 지원', 3000000, CURRENT_DATE - 6, CURRENT_DATE + 5, false,
 '한국장학재단 신청 기간 내 소득·성적 요건에 맞춰 신청합니다.', '', '{"국가장학금","등록금"}', '{}', '{}', 4100, 640, false),

('sch-02', '민간 장학재단 장학생 선발 (통합 공고)', 'scholarship', '외부재단·기업', '민간 장학재단', 'kosaf', 'https://www.kosaf.go.kr',
 '학기당 200만원', 2000000, CURRENT_DATE - 3, CURRENT_DATE + 25, false,
 '성적·경제 여건 등을 고려해 선발하는 외부 장학금입니다.', '', '{"외부장학","민간재단"}', '{}', '{}', 1200, 150, false),

('comp-01', 'AI 서비스 개발 해커톤 (온라인 예선 + 오프라인 본선)', 'competition', '해커톤', '데이터 경진대회 플랫폼', 'dacon', 'https://dacon.io',
 '총 상금 1,000만원 + 채용 연계', 4000000, CURRENT_DATE - 3, CURRENT_DATE + 11, false,
 '생성형 AI를 활용한 서비스 아이디어를 구현하는 해커톤입니다.', '', '{"해커톤","AI","개발"}', '{"ai","software"}', '{"컴퓨터","인공지능","데이터","정보통신"}', 2600, 380, false),

('comp-02', '대학생 아이디어·기획 공모전 (사회문제 해결)', 'competition', '아이디어·기획', '공공기관', 'wevity', 'https://www.wevity.com',
 '대상 500만원 + 인턴 기회', 5000000, CURRENT_DATE - 3, CURRENT_DATE + 16, false,
 '지역·환경 문제를 해결하는 기획안을 제출하는 공모전입니다.', '', '{"공모전","기획","아이디어"}', '{"business","public"}', '{}', 1800, 240, false),

('comp-03', '영상·디자인 콘텐츠 공모전', 'competition', '디자인·영상', '미디어 기업', 'linkareer', 'https://linkareer.com',
 '총 상금 700만원', 3000000, CURRENT_DATE - 3, CURRENT_DATE + 30, false,
 '숏폼 영상과 포스터 부문에서 작품을 모집합니다.', '', '{"영상","디자인","콘텐츠"}', '{"design"}', '{"디자인","미디어"}', 950, 110, false),

('inha-01', '수강정정 기간 안내', 'academic', '수강', '학사지원팀', 'inha', 'https://www.inha.ac.kr',
 '수강 신청 변경 가능', 0, CURRENT_DATE - 1, CURRENT_DATE + 4, false,
 '수강정정 기간 내 포털에서 과목을 추가·삭제할 수 있습니다.', '', '{"수강정정","학사"}', '{}', '{}', 5200, 300, false),

('inha-02', '다음 학기 등록금 납부 및 분할납부 안내', 'academic', '장학·등록', '재무회계팀', 'inha', 'https://www.inha.ac.kr',
 '분할납부 신청 가능', 0, CURRENT_DATE - 2, CURRENT_DATE + 15, false,
 '등록금 납부 기간과 분할납부 신청 방법을 안내합니다.', '', '{"등록금","납부"}', '{}', '{}', 4300, 250, false),

('inha-03', '졸업 요건 확인 및 졸업 사정 안내', 'academic', '학사', '학사지원팀', 'inha', 'https://www.inha.ac.kr',
 '졸업 대상자 필독', 0, CURRENT_DATE - 3, CURRENT_DATE + 22, false,
 '졸업 예정자는 이수 학점과 필수 요건을 반드시 확인하세요.', '', '{"졸업","학사"}', '{}', '{}', 2900, 180, false),

('inha-04', '취업 특강: 이력서·면접 컨설팅 데이', 'academic', '행사·특강', '진로취업지원팀', 'inha', 'https://www.inha.ac.kr',
 '1:1 컨설팅 제공', 0, CURRENT_DATE - 3, CURRENT_DATE + 10, false,
 '현직자 멘토와 함께하는 서류·면접 컨설팅 행사입니다.', '', '{"특강","취업","컨설팅"}', '{"business","software","engineering"}', '{}', 1700, 210, false)
ON CONFLICT (id) DO NOTHING;

