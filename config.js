// 삼척 꿈의 열차 — 설정 파일 (README.md 2단계 참고)
// Firebase 웹 설정 값은 원래 공개되는 값이라 GitHub에 올려도 괜찮아요.
// 기록은 firestore.rules 의 보안 규칙이 서버에서 지켜요.
window.DREAMTRAIN_CONFIG = {
  // Firebase 콘솔 > 프로젝트 설정 > 내 앱(웹) 의 firebaseConfig 값을 붙여 넣어요.
  FIREBASE: {
    apiKey: "AIzaSyDe51DTAblI7EW2hiuypX3kqqMCVoMAUnA",
    authDomain: "dreamtrain.firebaseapp.com",
    projectId: "dreamtrain",
    appId: "1:1003767591380:web:00ffe127ccf88b94452641"
  },

  // 교사 계정 이메일 (Firebase Authentication 에 만든 계정). 비밀번호는 여기에 쓰지 않아요.
  TEACHER_EMAIL: "rodemi@daum.net",

  // Firebase 없이 한 기기에서만 미리 볼 때 쓰는 교사 비밀번호 SHA-256 해시 (보통은 비워 둬요)
  LOCAL_TEACHER_PW_SHA256: ""
};
