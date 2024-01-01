"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const inversify_1 = require("inversify");
const pg = require("pg");
require("reflect-metadata");
let DatabaseService = class DatabaseService {
    constructor() {
        this.connectionConfig = {
            user: "postgres",
            database: "hopital_bd",
            password: "zaki2003",
            port: 5432,
            host: "127.0.0.1",
            keepAlive: true
        };
        this.pool = new pg.Pool(this.connectionConfig);
    }
    formatMedecinData(data) {
        return {
            idMedecin: data.idmedecin,
            prenom: data.prenom,
            nom: data.nom,
            specialite: data.specialite,
            anneesExperience: data.anneesexperience,
            idService: data.idservice
        };
    }
    getMedecins() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield this.pool.connect();
                const result = yield client.query('SELECT * FROM Medecins');
                const formattedResults = result.rows.map(row => {
                    return this.formatMedecinData(row);
                });
                client.release();
                return formattedResults;
            }
            catch (error) {
                throw new Error(`Error fetching medecins: ${error}`);
            }
        });
    }
    getMedecinById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            try {
                const result = yield client.query('SELECT * FROM Medecins WHERE idMedecin = $1', [id]);
                if (result.rows.length === 0) {
                    return null; // Medecin not found
                }
                return this.formatMedecinData(result.rows[0]);
            }
            finally {
                client.release();
            }
        });
    }
    getMedecinsSpecilities() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield this.pool.connect();
                const result = yield client.query('SELECT DISTINCT specialite FROM Medecins');
                client.release();
                return result;
            }
            catch (error) {
                throw new Error(`Error fetching medecins: ${error}`);
            }
        });
    }
    getServices() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            try {
                const result = yield client.query('SELECT * FROM Services');
                return result.rows.map(row => {
                    return {
                        idService: row.idservice,
                        nomService: row.nomservice,
                    };
                });
            }
            catch (error) {
                throw new Error(`Error fetching services: ${error}`);
            }
            finally {
                client.release();
            }
        });
    }
    addMedecin(medecin) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            try {
                const getMaxIdQuery = 'SELECT MAX(idMedecin) FROM Medecins';
                const maxIdResult = yield client.query(getMaxIdQuery);
                const maxId = maxIdResult.rows[0].max || 0;
                const newId = maxId + 1;
                const { idMedecin = newId, prenom, nom, specialite, anneesExperience, idService } = medecin;
                const query = `INSERT INTO Medecins (idMedecin, prenom, nom, specialite, anneesExperience, idService) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
                const values = [idMedecin, prenom, nom, specialite, anneesExperience, idService];
                const result = yield client.query(query, values);
                return result.rows[0];
            }
            finally {
                client.release();
            }
        });
    }
    updateMedecin(medecinId, updatedMedecin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idMedecin } = updatedMedecin, updateData = __rest(updatedMedecin, ["idMedecin"]);
                const query = {
                    text: `UPDATE Medecins SET nom = $1, prenom = $2, specialite = $3, anneesExperience = $4, idService = $5 WHERE idMedecin = $6`,
                    values: [updateData.nom, updateData.prenom, updateData.specialite, updateData.anneesExperience, updateData.idService, medecinId],
                };
                const result = yield this.pool.query(query);
                if (result.rowCount === 0) {
                    throw new Error(`Medecin with id ${medecinId} not found`);
                }
                return result;
            }
            catch (error) {
                throw new Error(`Error updating Medecin: ${error}`);
            }
        });
    }
    deleteMedecinById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            try {
                const existingMedecin = yield client.query('SELECT * FROM Medecins WHERE idMedecin = $1', [id]);
                if (existingMedecin.rows.length === 0)
                    return null; // Medecin not found
                const deleteQuery = 'DELETE FROM Medecins WHERE idMedecin = $1 RETURNING *';
                const result = yield client.query(deleteQuery, [id]);
                return result.rows[0];
            }
            finally {
                client.release();
            }
        });
    }
};
DatabaseService = __decorate([
    (0, inversify_1.injectable)()
], DatabaseService);
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database.service.js.map