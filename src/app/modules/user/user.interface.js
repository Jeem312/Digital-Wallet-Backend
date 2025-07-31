"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentApprovalStatus = exports.isActive = exports.AccountStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["USER"] = "user";
    Role["AGENT"] = "agent";
    Role["ADMIN"] = "admin";
    Role["PENDING"] = "pending";
})(Role || (exports.Role = Role = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "active";
    AccountStatus["BLOCKED"] = "blocked";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
var isActive;
(function (isActive) {
    isActive["ACTIVE"] = "active";
    isActive["INACTIVE"] = "inactive";
    isActive["BLOCKED"] = "blocked";
})(isActive || (exports.isActive = isActive = {}));
var AgentApprovalStatus;
(function (AgentApprovalStatus) {
    AgentApprovalStatus["ACCEPTED"] = "accepted";
    AgentApprovalStatus["REJECTED"] = "rejected";
})(AgentApprovalStatus || (exports.AgentApprovalStatus = AgentApprovalStatus = {}));
