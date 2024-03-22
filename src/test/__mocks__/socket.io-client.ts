const ioMock = () => {
    return {
        emit: () => {},
        on: () => {},
        off: () => {},
    };
};

module.exports = {
    __esModule: true,
    io: ioMock,
};