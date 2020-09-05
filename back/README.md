## 사용 모듈
- npm info "모듈이름" peerDependencies: 설치모듈에 필요한 모듈 정보
- npx install-peerdeps --dev 모듈이름: 설치모듈에 필요한 모듈도 같이 설치
 
- bcrpyt: 비밀번호 암호화
- cookie-parser / express-session: 로그인 정보 쿠키 세션로 관리
- dotenv: 비밀번호 관리
- cors: 프론트 백엔드 서버 주소 다른 경우 보안제약 해결
- helmet / hpp: 보안
- morgan: 로그
- multer: 이미지 업로드
- passport / passport-local: 로그인 관리 / 회원가입 같은 처리 쉽게 도와줌
- sequelize / sequelize-cli: ORM, DB를 JS로 컨트롤
- tedious: mssql 이용

- eslint: 문법 봐줌
- eslint-config-airbnb: airbnb에서 쓰는 문법규칙
- eslint-config-prettier: prettier가 관리해줄 수 있는 코드스타일은 eslint가 아니라 prettier가 담당하게 한다.

## node_moduels 실행 관련
- 전역설치 하지 않아도 ./node_modules/.bin에 모듈이 바이너리로 컴파일 되어 들어있으면 스크립트나 직접 경로 설정으로 실행가능
- $ ./node_modules/.bin/nodemon
- package.json - script - dev: nodemon => $ npm run dev