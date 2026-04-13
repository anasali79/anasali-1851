import { MigrationInterface, QueryRunner } from "typeorm";

export class FixBrandCreatedByNullable1776077288706 implements MigrationInterface {
    name = 'FixBrandCreatedByNullable1776077288706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_96db6bbbaa6f23cad26871339b" ON "brands" ("name")`);
        await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "created_by_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "created_by_id" SET NOT NULL`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_96db6bbbaa6f23cad26871339b"`);
    }
}