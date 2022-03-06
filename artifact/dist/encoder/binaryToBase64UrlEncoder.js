define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BinaryToBase64UrlEncoder = void 0;
    var Side;
    (function (Side) {
        Side[Side["BEGINING"] = 0] = "BEGINING";
        Side[Side["END"] = 1] = "END";
    })(Side || (Side = {}));
    /**
     * Converts a binary string to Base64Url (RFC 4648 §5)
     */
    class BinaryToBase64UrlEncoder {
        encode(binary) {
            const padded = BinaryToBase64UrlEncoder.padString(binary, Side.END, 8, "0");
            const bytes = padded.match(/.{8}/g);
            const chars = bytes
                .map(b => String.fromCharCode(parseInt(b, 2)))
                .join("");
            const b64 = btoa(chars);
            const b64u = b64
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');
            return b64u;
        }
        decode(b64u) {
            const padded = BinaryToBase64UrlEncoder.padString(b64u, Side.END, 4, "=");
            const b64 = padded
                .replace(/-/g, '+')
                .replace(/_/g, '/');
            let chars;
            try {
                chars = atob(b64);
            }
            catch (e) {
                throw "Invalid Base64Url string!";
            }
            const bytes = chars.split("")
                .map(ch => ch.charCodeAt(0).toString(2).padStart(8, "0"))
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
    exports.BinaryToBase64UrlEncoder = BinaryToBase64UrlEncoder;
});
