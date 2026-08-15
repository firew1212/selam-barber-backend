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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentDto = exports.PaymentMethodDto = exports.PaymentTypeDto = void 0;
const class_validator_1 = require("class-validator");
var PaymentTypeDto;
(function (PaymentTypeDto) {
    PaymentTypeDto["DEPOSIT"] = "DEPOSIT";
    PaymentTypeDto["FINAL"] = "FINAL";
})(PaymentTypeDto || (exports.PaymentTypeDto = PaymentTypeDto = {}));
var PaymentMethodDto;
(function (PaymentMethodDto) {
    PaymentMethodDto["TELEBIRR"] = "TELEBIRR";
    PaymentMethodDto["BANK_TRANSFER"] = "BANK_TRANSFER";
})(PaymentMethodDto || (exports.PaymentMethodDto = PaymentMethodDto = {}));
class CreatePaymentDto {
    appointmentId;
    amount;
    paymentType;
    paymentMethod;
}
exports.CreatePaymentDto = CreatePaymentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "appointmentId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(PaymentTypeDto),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(PaymentMethodDto),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentMethod", void 0);
//# sourceMappingURL=create-payment.dto.js.map