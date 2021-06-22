import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTestAndJobs1598884125550 implements MigrationInterface {
    name = 'updateTestAndJobs1598884125550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "estimated_tests" integer, "title" character varying, "start_date" TIMESTAMP, "end_date" TIMESTAMP, "customer_id" uuid, "created_by_id" uuid, "client_id" uuid, CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying, "result" character varying, "temperature" integer, "patient_id" uuid, "job_id" uuid, "client_id" uuid, "tester_id" uuid, "customer_id" uuid, CONSTRAINT "PK_4301ca51edf839623386860aed2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_61855f3e378cc40ce4144d045b5" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_21469bb2d10f6a142694810c220" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_dec6205e2cd13841763710f9892" FOREIGN KEY ("client_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tests" ADD CONSTRAINT "FK_3f04214c57f5d32d3c45a2d1d15" FOREIGN KEY ("patient_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tests" ADD CONSTRAINT "FK_8762c2d6b7f16d531392d3e3932" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tests" ADD CONSTRAINT "FK_41a29af7fb64afbb385ea20dde8" FOREIGN KEY ("client_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tests" ADD CONSTRAINT "FK_22e8c3851ca66823b5a2d2b3218" FOREIGN KEY ("tester_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tests" ADD CONSTRAINT "FK_5f599cc6ddce8e5a23c1cad3300" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" DROP CONSTRAINT "FK_5f599cc6ddce8e5a23c1cad3300"`);
        await queryRunner.query(`ALTER TABLE "tests" DROP CONSTRAINT "FK_22e8c3851ca66823b5a2d2b3218"`);
        await queryRunner.query(`ALTER TABLE "tests" DROP CONSTRAINT "FK_41a29af7fb64afbb385ea20dde8"`);
        await queryRunner.query(`ALTER TABLE "tests" DROP CONSTRAINT "FK_8762c2d6b7f16d531392d3e3932"`);
        await queryRunner.query(`ALTER TABLE "tests" DROP CONSTRAINT "FK_3f04214c57f5d32d3c45a2d1d15"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_dec6205e2cd13841763710f9892"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_21469bb2d10f6a142694810c220"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_61855f3e378cc40ce4144d045b5"`);
        await queryRunner.query(`DROP TABLE "tests"`);
        await queryRunner.query(`DROP TABLE "jobs"`);
    }

}
