import { Medecin } from "@app/interface/medecin";
import { Service } from "@app/interface/service";
import { injectable } from "inversify";
import * as pg from "pg";
import "reflect-metadata";

@injectable()
export class DatabaseService {
  public connectionConfig: pg.ConnectionConfig = {
    user: "postgres",
    database: "hopital_bd",
    password: "zaki2003",
    port: 5432,         
    host: "127.0.0.1",
    keepAlive: true
  };

  public pool: pg.Pool = new pg.Pool(this.connectionConfig);

  private formatMedecinData(data: any): Medecin {
    return {
      idMedecin: data.idmedecin,
      prenom: data.prenom,
      nom: data.nom,
      specialite: data.specialite,
      anneesExperience: data.anneesexperience,
      idService: data.idservice
    };
  }


  public async getMedecins(): Promise<Medecin[]> {
    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT * FROM Medecins');
      const formattedResults = result.rows.map(row => {
        return this.formatMedecinData(row);
      });

      client.release();
      return formattedResults;
    } catch (error) {
      throw new Error(`Error fetching medecins: ${error}`);
    }
  }

  public async getMedecinById(id: number): Promise<Medecin | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM Medecins WHERE idMedecin = $1', [id]);
      if (result.rows.length === 0) {
        return null; // Medecin not found
      }
      return this.formatMedecinData(result.rows[0]);
    } finally {
      client.release();
    }
  }

  public async getMedecinsSpecilities(): Promise<pg.QueryResult> {
    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT DISTINCT specialite FROM Medecins');
      client.release();
      return result;
    } catch (error) {
      throw new Error(`Error fetching medecins: ${error}`);
    }
  }

  public async getServices(): Promise<Service[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM Services');
      return result.rows.map(
        row => {
          return {
            idService: row.idservice,
            nomService: row.nomservice,
          };
          }
      )
;    } catch (error) {
      throw new Error(`Error fetching services: ${error}`);
    } finally {
      client.release();
    }
  }
  

  public async addMedecin(medecin: Medecin): Promise<Medecin> {
    const client = await this.pool.connect();
    try {
      const getMaxIdQuery = 'SELECT MAX(idMedecin) FROM Medecins';
      const maxIdResult = await client.query(getMaxIdQuery);
      const maxId = maxIdResult.rows[0].max || 0;
      const newId = maxId + 1;
      const { idMedecin=newId,prenom, nom, specialite, anneesExperience, idService } = medecin;
      const query = `INSERT INTO Medecins (idMedecin, prenom, nom, specialite, anneesExperience, idService) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      const values = [idMedecin,prenom, nom, specialite, anneesExperience, idService];

      const result = await client.query(query, values);
      return result.rows[0] as Medecin;
    } finally {
      client.release();
    }
  }

  public async updateMedecin(medecinId: number, updatedMedecin: Medecin): Promise<pg.QueryResult> {
    try {
      const { idMedecin, ...updateData } = updatedMedecin;
      const query = {
        text: `UPDATE Medecins SET nom = $1, prenom = $2, specialite = $3, anneesExperience = $4, idService = $5 WHERE idMedecin = $6`,
        values: [updateData.nom, updateData.prenom, updateData.specialite, updateData.anneesExperience, updateData.idService, medecinId],
      };
      const result = await this.pool.query(query);
      if (result.rowCount === 0) {
        throw new Error(`Medecin with id ${medecinId} not found`);
      }
      return result;
    } catch (error) {
      throw new Error(`Error updating Medecin: ${error}`);
    }
  }

  public async deleteMedecinById(id: number): Promise<Medecin | null> {
    const client = await this.pool.connect();
    try {
      const existingMedecin = await client.query('SELECT * FROM Medecins WHERE idMedecin = $1', [id]);
      
      if (existingMedecin.rows.length === 0) 
        return null; // Medecin not found

      const deleteQuery = 'DELETE FROM Medecins WHERE idMedecin = $1 RETURNING *';
      const result = await client.query(deleteQuery, [id]);
      return result.rows[0] as Medecin;
    } finally {
      client.release();
    }
  }

  
}

