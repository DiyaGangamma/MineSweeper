define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BinaryToBase64UrlEncoderV2 = void 0;
    var Side;
    (function (Side) {
        Side[Side["BEGINING"] = 0] = "BEGINING";
        Side[Side["END"] = 1] = "END";
    })(Side || (Side = {}));
    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    /**
     * Converts a binary string to Base64Url (RFC 4648 §5)
     *
     * This version uses direct conversion at bit level using custom alphabet
     */
    class BinaryToBase64UrlEncoderV2 {
        encode(binary) {
            const padded = BinaryToBase64UrlEncoderV2.padString(binary, Side.END, 6, "0");
            const b64u = padded.match(/.{6}/g)
                .map(sextet => ALPHABET[parseInt(sextet, 2)])
                .join("");
            return b64u;
        }
        decode(b64u) {
            const bytes = b64u.split("")
                .map(ch => {
                const index = ALPHABET.indexOf(ch);
                if (index == -1) {
                    throw "Invalid Base64Url string!";
                }
                return index;
            })
                .map(idx => idx.toString(2).padStart(6, "0"))
                .join("");
            return bytes;
        }
        static padString(str, s, factor, char) {
            const padLen = (factor - str.length % factor) % factor;
            if (s == Side.BEGINING) {
                return str.padStart(str.length + padLen, char);
            }
            return str.padEnd(str.length + padLen, char);
        }
    }
    exports.BinaryToBase64UrlEncoderV2 = BinaryToBase64UrlEncoderV2;
});
