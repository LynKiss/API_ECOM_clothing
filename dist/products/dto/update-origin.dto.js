"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOriginDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_origin_dto_1 = require("./create-origin.dto");
class UpdateOriginDto extends (0, mapped_types_1.PartialType)(create_origin_dto_1.CreateOriginDto) {
}
exports.UpdateOriginDto = UpdateOriginDto;
//# sourceMappingURL=update-origin.dto.js.map