"use strict";
// src/app/modules/user/user.interface.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentApprovalStatus = exports.isActive = exports.Role = void 0;
var Role;
(function (Role) {
    Role["USER"] = "user";
    Role["AGENT"] = "agent";
    Role["ADMIN"] = "admin";
    Role["PENDING"] = "pending";
})(Role || (exports.Role = Role = {}));
var isActive;
(function (isActive) {
    isActive["ACTIVE"] = "active";
    isActive["INACTIVE"] = "inactive";
    isActive["BLOCKED"] = "blocked";
})(isActive || (exports.isActive = isActive = {}));
var AgentApprovalStatus;
(function (AgentApprovalStatus) {
    AgentApprovalStatus["PENDING"] = "pending";
    AgentApprovalStatus["ACCEPTED"] = "accepted";
    AgentApprovalStatus["REJECTED"] = "rejected";
})(AgentApprovalStatus || (exports.AgentApprovalStatus = AgentApprovalStatus = {}));
