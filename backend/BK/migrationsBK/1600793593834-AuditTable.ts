import {MigrationInterface, QueryRunner} from "typeorm";

export class AuditTable1600793593834 implements MigrationInterface {
    name = 'AuditTable1600793593834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "audits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "action" character varying, "description" character varying, "entity_name" character varying, "entity_id" character varying, "user_id" uuid, "customer_id" uuid, CONSTRAINT "PK_b2d7a2089999197dc7024820f28" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "audits" ADD CONSTRAINT "FK_96b1bc5c4ff586cff3f85bc91fb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audits" ADD CONSTRAINT "FK_236a383b1007cf64f0c8c7f6534" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audits" DROP CONSTRAINT "FK_236a383b1007cf64f0c8c7f6534"`);
        await queryRunner.query(`ALTER TABLE "audits" DROP CONSTRAINT "FK_96b1bc5c4ff586cff3f85bc91fb"`);
        await queryRunner.query(`DROP TABLE "audits"`);
    }

}
