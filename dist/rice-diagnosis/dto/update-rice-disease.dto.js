"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRiceDiseaseDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_rice_disease_dto_1 = require("./create-rice-disease.dto");
class UpdateRiceDiseaseDto extends (0, mapped_types_1.PartialType)(create_rice_disease_dto_1.CreateRiceDiseaseDto) {
}
exports.UpdateRiceDiseaseDto = UpdateRiceDiseaseDto;
//# sourceMappingURL=update-rice-disease.dto.js.map