export default {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        "^.+\\.tsx?$": "ts-jest" 
    // process `*.tsx` files with `ts-jest`
    },
    moduleNameMapper: {
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/test/__mocks__/fileMock.ts',
        "\\.(css|less|scss|sass)$": "<rootDir>/src/test/__mocks__/styleMock.ts",
        "\\/constants/ENV": "<rootDir>/src/test/__mocks__/constantsMock.ts",
        "socket.io-client": "<rootDir>/src/test/__mocks__/socket.io-clientMock.ts",
    },
};