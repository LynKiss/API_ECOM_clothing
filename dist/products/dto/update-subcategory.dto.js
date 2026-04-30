"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubcategoryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_subcategory_dto_1 = require("./create-subcategory.dto");
class UpdateSubcategoryDto extends (0, mapped_types_1.PartialType)(create_subcategory_dto_1.CreateSubcategoryDto) {
}
exports.UpdateSubcategoryDto = UpdateSubcategoryDto;
//# sourceMappingURL=update-subcategory.dto.js.map