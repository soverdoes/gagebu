/* Firebase 설정
 *
 * 이 값들은 공개되어도 되는 식별자입니다. 실제 접근 통제는 firestore.rules 가 합니다.
 * (로그인하지 않으면 아무것도 읽지 못하고, 로그인해도 자기 가구 문서만 읽습니다.)
 *
 * 비워 두면(null) 로그인 없이 브라우저에만 저장하는 방식으로 동작합니다.
 */
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyALAHBssKTcbmPmrfxk2BWFly8m8Y8kMUg",
  authDomain: "gagebu-d7ed0.firebaseapp.com",
  projectId: "gagebu-d7ed0",
  storageBucket: "gagebu-d7ed0.firebasestorage.app",
  messagingSenderId: "815198438",
  appId: "1:815198438:web:f783ead54fef6181dccb27"
};
