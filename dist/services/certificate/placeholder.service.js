"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceholderService = void 0;
class PlaceholderService {
    buildReplacements(data) {
        const replacements = {};
        for (const [placeholder, field] of Object.entries(PlaceholderService.PLACEHOLDER_FIELDS)) {
            const value = data[field];
            if (value !== undefined && value !== null) {
                replacements[placeholder] = value;
            }
        }
        return replacements;
    }
}
exports.PlaceholderService = PlaceholderService;
PlaceholderService.PLACEHOLDER_FIELDS = {
    "{{NAME}}": "name",
    "{{COURSE}}": "course",
    "{{DATE}}": "date",
    "{{CERTIFICATE_NUMBER}}": "certificateNumber",
    "{{INSTRUCTOR}}": "instructor",
    "{{GRADE}}": "grade",
    "{{QR_CODE}}": "qrCode",
};
