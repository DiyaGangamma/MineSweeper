define(["require", "exports", "./game", "./config", "./pairer/cantorPairer", "./encoder/binaryToBase64UrlEncoderV2"], function (require, exports, game_1, config_1, cantorPairer_1, binaryToBase64UrlEncoderV2_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const config = {
        mode: (sessionStorage.length != 0) ? sessionStorage.getItem("mode"): config_1.MODE_NAME.Beginner,
        encoder: binaryToBase64UrlEncoderV2_1.BinaryToBase64UrlEncoderV2.prototype,
        modePairer: cantorPairer_1.CantorPairer.prototype,
        firstClick: config_1.FIRST_CLICK.GuaranteedCascade,
        debug: false,
    };
    new game_1.Game(config);
});
