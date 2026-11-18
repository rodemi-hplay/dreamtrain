# 🚆 삼척 꿈의 열차 탈출 작전

근덕중학교 3학년 진로 수업용 **개인 방탈출 게임**입니다. 근덕역에서 꿈의 열차를 타고 5칸을 지나며 열쇠 숫자 5개를 모아 삼척역에 내리는 이야기예요.

| 칸 | 내용 |
|---|---|
| 1. 가치의 칸 (근덕역) | 진로 가치 알아보기, 나의 가치 3개 고르기 |
| 2. 일터 지도 칸 | 우리 지역(삼척·동해·강릉) 일터 60% + 대도시(서울·수도권·인천) 일터 40% |
| 3. 직업 도감 칸 | 직업 68개, 필요한 힘(역량), 학과, 고교 추천 과목 |
| 4. 배움 길 칸 | 학과 연결, 2022 개정 교육과정 고교 선택과목 고르기 |
| 5. 장벽 넘기 칸 (환선굴) | 진로 장벽과 해결 방법 |
| 삼척역 | 비밀번호 입력 → 꿈 직업 고르기 → 미래 소감 쓰기 → 진로 로드맵 |

- 최종 비밀번호: **31582**
- 교사 페이지: 시작 화면 아래 **👩‍🏫 선생님 페이지** → 실시간 진행 상황, 학생 소감, 🎬 소감 발표 모드, 📋 CSV 복사

## 파일 구조

```
index.html        게임과 교사 페이지 (한 파일)
config.js         Firebase 설정과 교사 이메일 ← 여기만 고치면 돼요
firestore.rules   Firestore 보안 규칙 (학생은 자기 기록만 쓰기, 교사만 읽기)
firebase.json     Firebase CLI 로 보안 규칙을 배포할 때 쓰는 설정
```

## 어떻게 지켜지나요?

- **학생**: 로그인 화면 없이 Firebase **익명 로그인**이 자동으로 돼요. 자기 기록 문서만 만들고 고칠 수 있고, 친구 기록은 읽을 수 없어요.
- **교사**: Firebase에 만든 **교사 계정(이메일+비밀번호)** 으로 로그인해요. `admins` 컬렉션에 UID가 등록된 계정만 모든 기록을 읽고 지울 수 있어요.
- 비밀번호는 **Firebase 콘솔에만** 저장되고, 코드·GitHub에는 들어가지 않아요.
- `config.js`의 Firebase 웹 설정(apiKey 등)은 원래 공개되는 값이라 GitHub에 올려도 괜찮아요. 보안은 `firestore.rules`가 서버에서 지켜요.

---

## 1단계. Firebase 프로젝트 만들기 (Firebase 콘솔, 직접)

1. https://console.firebase.google.com 에서 **프로젝트 추가** (Google 애널리틱스는 꺼도 돼요).
2. **빌드 → Authentication → 시작하기 → 로그인 방법**에서 두 가지를 켭니다.
   - **익명**
   - **이메일/비밀번호**
3. **Authentication → 사용자 → 사용자 추가**: 교사 이메일과 비밀번호로 계정을 만듭니다.
   만든 뒤 표에 나오는 **사용자 UID**를 복사해 둡니다.
4. **Authentication → 설정 → 승인된 도메인**에 GitHub Pages 주소의 도메인(`<계정>.github.io`)을 추가합니다.
5. **빌드 → Firestore Database → 데이터베이스 만들기**
   - 위치: **asia-northeast3 (서울)** 권장
   - **프로덕션 모드**로 시작
6. **Firestore → 규칙** 탭에 `firestore.rules` 내용을 붙여 넣고 **게시**합니다. (Claude Code로 배포해도 돼요. 아래 참고)
7. **Firestore → 데이터 → 컬렉션 시작**
   - 컬렉션 ID: `admins`
   - 문서 ID: 3번에서 복사한 **교사 UID**
   - 필드: `role` (문자열) = `teacher`
8. **프로젝트 설정(⚙️) → 일반 → 내 앱 → 웹 앱 추가(</>)** → 나오는 `firebaseConfig` 값을 복사합니다.

## 2단계. config.js 채우기

```js
window.DREAMTRAIN_CONFIG = {
  FIREBASE: {
    apiKey: "AIza...",
    authDomain: "프로젝트ID.firebaseapp.com",
    projectId: "프로젝트ID",
    appId: "1:...:web:..."
  },
  TEACHER_EMAIL: "teacher@example.com",
  LOCAL_TEACHER_PW_SHA256: ""
};
```

## 3단계. GitHub에 올리고 GitHub Pages 켜기

1. 이 폴더를 GitHub 저장소로 올립니다.
2. 저장소 **Settings → Pages**에서 Source `Deploy from a branch`, Branch `main` / `/ (root)`.
3. `https://<계정>.github.io/<저장소>/` 주소를 학생들에게 줍니다.

### Claude Code에 이렇게 부탁하세요

> 이 dreamtrain 폴더를 `dreamtrain` 이라는 새 GitHub 저장소로 올리고, main 브랜치 루트로 GitHub Pages를 켜 줘.

> (선택) Firebase CLI로 보안 규칙을 배포해 줘. 프로젝트 ID는 `<프로젝트ID>` 야.
> `npx firebase-tools login` 후 `npx firebase-tools deploy --only firestore:rules --project <프로젝트ID>`

## 4단계. 수업 전 확인

- [ ] 학생 기기에서 GitHub Pages 주소가 열리는지
- [ ] 이름 입력 후 출발 → 교사 페이지 진행 상황에 **바로** 나타나는지
- [ ] 소감 제출 → '학생 소감' 탭과 발표 모드에 나오는지
- [ ] 교사 로그인이 안 되면: 이메일/비밀번호 로그인 켜기, `TEACHER_EMAIL`, `admins` 문서 ID(UID)를 다시 확인
- [ ] 학생 기록이 안 보이면: 익명 로그인 켜기, 승인된 도메인, 보안 규칙 게시 여부를 확인
- [ ] 수업이 끝나면 📋 CSV 복사로 보관한 뒤 🗑️ 기록 모두 지우기

## 내용 수정

`index.html` 안에서 아래 이름으로 찾으면 바로 고칠 수 있어요.

- `CODE` 최종 비밀번호 숫자
- `VALUES` 진로 가치 카드
- `LOCAL_SPOTS`, `CITY_SPOTS` 2칸 일터 지도 (우리 지역 / 대도시)
- `RAW` 직업 도감 (이름, 아이콘, 묶음, 학과, 하는 일, 역량, 고교 과목, 우리 지역 연결) / `BIG` 대도시 일터
- `DREAMS` 4칸 고교 과목 고르기
- `WALLS`, `LIGHTS` 5칸 진로 장벽과 해결 방법
- `TALK` 발표 모드 이야깃거리 질문

## 참고

- Firebase 무료 요금제(Spark)로 학급·학년 단위 수업은 충분해요.
- 학생 이름과 소감이 저장되니 학교의 개인정보 처리 기준을 확인하고, 수업 후 기록을 지워 주세요.
- 고교 과목 분류는 2022 개정 교육과정 보통교과(공통·일반선택·진로선택·융합선택)를 따랐습니다. 학교마다 개설 과목이 다르니 진학할 학교의 교육과정 편성표를 함께 안내해 주세요.
- 대학 학과 이름은 학교 개편으로 바뀔 수 있으니 수업 전에 확인해 주세요.
