import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBrandTable1776073134471 implements MigrationInterface {
    name = 'CreateBrandTable1776073134471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "brands" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" text, "logoUrl" character varying(255), "created_by_id" uuid, "updated_by_id" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "brand_id" integer`);
        await queryRunner.query(`ALTER TABLE "brands" ADD CONSTRAINT "FK_6bcdb4b8f471f0a9203754abe98" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "brands" ADD CONSTRAINT "FK_updated_by" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_01d93d1f1a8df7db7ae65751cbc" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_01d93d1f1a8df7db7ae65751cbc"`);
        await queryRunner.query(`ALTER TABLE "brands" DROP CONSTRAINT "FK_updated_by"`);
        await queryRunner.query(`ALTER TABLE "brands" DROP CONSTRAINT "FK_6bcdb4b8f471f0a9203754abe98"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "brand_id"`);
        await queryRunner.query(`DROP TABLE "brands"`);
    }
}