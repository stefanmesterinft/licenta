import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTestSamples1600093131285 implements MigrationInterface {
    name = 'AddTestSamples1600093131285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "samples" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "identifier" character varying, "barcode" character varying, "units" integer, "type" character varying, "location" geometry(Point,4326), "assigned_id" uuid, "customer_id" uuid, "renter_id" uuid, CONSTRAINT "UQ_6f6e0f7b6bb8616a1e954cab41a" UNIQUE ("identifier"), CONSTRAINT "PK_d68b5b3bd25a6851b033fb63444" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "samples" ADD CONSTRAINT "FK_4e1dcbdad38df4ad6e241876f4a" FOREIGN KEY ("assigned_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "samples" ADD CONSTRAINT "FK_3d233b878f3aaedaacb18b270b1" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "samples" ADD CONSTRAINT "FK_77dc671896720fe34d11ebf9d77" FOREIGN KEY ("renter_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "samples" DROP CONSTRAINT "FK_77dc671896720fe34d11ebf9d77"`);
        await queryRunner.query(`ALTER TABLE "samples" DROP CONSTRAINT "FK_3d233b878f3aaedaacb18b270b1"`);
        await queryRunner.query(`ALTER TABLE "samples" DROP CONSTRAINT "FK_4e1dcbdad38df4ad6e241876f4a"`);
        await queryRunner.query(`DROP TABLE "samples"`);
    }

}
