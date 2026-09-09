/* Firebase 설정
 *
 * 아래 null 을 Firebase 콘솔에서 받은 설정 객체로 바꾸면 로그인·서버 저장이 켜집니다.
 * 비워 두면 지금처럼 브라우저에만 저장하는 방식으로 동작합니다.
 *
 * 이 값들은 공개되어도 되는 식별자입니다. 실제 접근 통제는 firestore.rules 가 합니다.
 * (Firebase 공식 문서에서도 웹 설정값은 비밀이 아니라고 안내합니다.)
 *
 * 예시:
 * window.FIREBASE_CONFIG = {
 *   apiKey: "AIza...",
 *   authDomain: "내프로젝트.firebaseapp.com",
 *   projectId: "내프로젝트",
 *   storageBucket: "내프로젝트.appspot.com",
 *   messagingSenderId: "000000000000",
 *   appId: "1:000000000000:web:abcdef"
 * };
 */
window.FIREBASE_CONFIG = null;
