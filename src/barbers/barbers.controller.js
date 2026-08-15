"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarbersController = void 0;
const common_1 = require("@nestjs/common");
const barbers_service_1 = require("./barbers.service");
const update_barber_status_dto_1 = require("./dto/update-barber-status.dto");
const create_vacation_dto_1 = require("./dto/create-vacation.dto");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let BarbersController = class BarbersController {
    barbersService;
    constructor(barbersService) {
        this.barbersService = barbersService;
    }
    findAll() {
        return this.barbersService.findAll();
    }
    findOne(id) {
        return this.barbersService.findOne(id);
    }
    updateStatus(id, dto) {
        return this.barbersService.updateStatus(id, dto);
    }
    createVacation(id, dto) {
        return this.barbersService.createVacation(id, dto);
    }
    getVacations(id) {
        return this.barbersService.getVacations(id);
    }
};
exports.BarbersController = BarbersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BarbersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BarbersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'BARBER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_barber_status_dto_1.UpdateBarberStatusDto]),
    __metadata("design:returntype", void 0)
], BarbersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/vacations'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'BARBER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_vacation_dto_1.CreateVacationDto]),
    __metadata("design:returntype", void 0)
], BarbersController.prototype, "createVacation", null);
__decorate([
    (0, common_1.Get)(':id/vacations'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BarbersController.prototype, "getVacations", null);
exports.BarbersController = BarbersController = __decorate([
    (0, common_1.Controller)('barbers'),
    __metadata("design:paramtypes", [barbers_service_1.BarbersService])
], BarbersController);
//# sourceMappingURL=barbers.controller.js.map