# SNS like clone web application

1. # 개요 
이 프로젝트는 **graphQL(with apollo)**, **react.js**, **node.js** 그리고 **MongoDB**를 사용하여 제작한 웹 애플리케이션 입니다.

2. # 실행 방법
- 서버 폴더에서
>npm i
>npm start

- 클라이언트 폴더에서
>npm i
>npm run dev

이 명령을 통해 서버와 클라이언트 파트에서 각각 필요한 패키지들을 다운 받고 실행하면 됩니다. 

MongoDB와 관련된 파일들은 nodemon.json 파일을 생성하여 정보가 들어나지 않는 방식으로 처리했습니다.

3. # 외부 라이브러리 사용
    1. 서버 파트 사용 기술
        - MongoDB 
        >NoSQL DB를 사용하여 사용자 정보와 사용자가 업로드한 글의 내용들을 저장하는데 활용했습니다. 

        - json web token
        >Authentication을 할때 토큰관련 처리를 위해 도입하였습니다.

        - bcryptjs
        >비밀번호등 민감한 정보를 사용자가 지정한 대로 DB에 바로 저장하지 않고 해쉬화 해서 저장하기 위해 사용했습니다.

        - GraphQL
        >서버와 클라이언트 사이의 데이터 송 수신 과정에서 필요한 정보만 선별하여 가져올 수 있는 GraphQL을 도입하였습니다.

        - Apollo Server
        >GraphQL을 활용하는데 서버파트인 Express와 클라이언트 파트인 ReactJS에 간편한 통신을 위해 도입하였습니다.

    2. 프론트엔드 파트 사용 기술
        - ReactJS
        >앱의 프론트엔드 파트제작을 담당하며 컴포넌트의 유지 및 보수를 편리하게 하기 위해 사용했습니다.

        - Typescript
        >프론트엔드 부분의 코드량이 늘어남에 따라 컴파일 전에 오류를 미리 체크할 수 있는 Typescript를 도입하여 프로젝트를 관리하였습니다.

        - Apollo Client
        >GraphQL을 활용하는데 서버파트인 Express와 클라이언트 파트인 ReactJS에 간편한 통신을 위해 도입하였습니다.

        -Next.JS
        >ReactJS의 멀티 페이지 렌더링을 활용하기 위해 이를 중계해주는 Next.JS를 활용하였습니다.


4. # 향후 발전 방향
본격적인 앱의 Deploy에 앞서 글을 올리면 이미지 파일을 저장해야 하므로 이를 클라우드 컴퓨터를 활용하여 업로드 하는 방향을 고려하고 있습니다. 이에 따라 AWS(Amazone Web Service)를 사용하여 관리할 예정입니다.