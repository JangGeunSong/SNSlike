module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.jest.json"
        }
    },
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/client/__test__"
    ],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/client/__test__"
    ] 
    // 이 옵션을 넣어서 오직 서버의 유효성만 테스트 하도록 정의하였습니다. (Default path: /node_modules/ 에 더해 클라이언트 부분을 무시하도록 정의)
};