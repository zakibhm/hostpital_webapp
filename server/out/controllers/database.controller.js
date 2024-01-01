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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseController = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const database_service_1 = require("../services/database.service");
const types_1 = require("../types");
let DatabaseController = class DatabaseController {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    get router() {
        const router = (0, express_1.Router)();
        router.get("/medecins", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const medecins = yield this.databaseService.getMedecins();
                res.status(200).json(medecins);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to fetch Medecins" });
            }
        }));
        router.get("/medecins/specialites", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const medecins = yield this.databaseService.getMedecinsSpecilities();
                res.status(200).json(medecins.rows);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to fetch Medecins" });
            }
        }));
        router.get("/medecins/services", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const medecins = yield this.databaseService.getServices();
                res.status(200).json(medecins);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to fetch Services" });
            }
        }));
        router.get("/medecins/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const medecin = yield this.databaseService.getMedecinById(parseInt(id, 10));
                if (medecin) {
                    res.status(200).json(medecin);
                }
                else {
                    res.status(404).json({ error: "Medecin not found" });
                }
            }
            catch (error) {
                res.status(500).json({ error: "Failed to fetch Medecin" });
            }
        }));
        router.delete('/medecins/delete/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const deletedMedecin = yield this.databaseService.deleteMedecinById(parseInt(id, 10));
                if (deletedMedecin) {
                    res.status(200).json({ message: 'Medecin deleted successfully' });
                }
                else {
                    res.status(404).json({ error: 'Medecin not found' });
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete Medecin' });
            }
        }));
        router.post('/medecins/insert', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newMedecinData = req.body;
                const createdMedecin = yield this.databaseService.addMedecin(newMedecinData);
                res.status(201).json(createdMedecin);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create Medecin' });
            }
        }));
        router.put('/medecins/update/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const updatedMedecinData = req.body;
                const updatedMedecin = yield this.databaseService.updateMedecin(parseInt(id, 10), updatedMedecinData);
                if (!updatedMedecin) {
                    res.status(404).json({ error: 'Medecin not found' });
                    return;
                }
                res.status(200).json(updatedMedecin);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update Medecin' });
            }
        }));
        return router;
    }
};
DatabaseController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.default.DatabaseService)),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], DatabaseController);
exports.DatabaseController = DatabaseController;
//# sourceMappingURL=database.controller.js.map