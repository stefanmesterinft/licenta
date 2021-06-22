import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTestersToTEst1599837908028 implements MigrationInterface {
    name = 'AddTestersToTEst1599837908028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" DROP CONSTRAINT "FK_22e8c3851ca66823b5a2d2b3218"`);
        await queryRunner.query(`CREATE TABLE "tests_testers_users" ("tests_id" uuid NOT NULL, "users_id" uuid NOT NULL, CONSTRAINT "PK_a2b675ddc4fbd3e94905e23ae1c" PRIMARY KEY ("tests_id", "users_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2bd583e5c40df70b13417be88b" ON "tests_testers_users" ("tests_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_32fcc15b1ad811a5eee70a0601" ON "tests_testers_users" ("users_id") `);
        await queryRunner.query(`ALTER TABLE "tests" DROP COLUMN "tester_id"`);
        await queryRunner.query(`ALTER TABLE "tests_testers_users" ADD CONSTRAINT "FK_2bd583e5c40df70b13417be88b0" FOREIGN KEY ("tests_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tests_testers_users" ADD CONSTRAINT "FK_32fcc15b1ad811a5eee70a0601b" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests_testers_users" DROP CONSTRAINT "FK_32fcc15b1ad811a5eee70a0601b"`);
        await queryRunner.query(`ALTER TABLE "tests_testers_users" DROP CONSTRAINT "FK_2bd583e5c40df70b13417be88b0"`);
        await queryRunner.query(`ALTER TABLE "tests" ADD "tester_id" uuid`);
        await queryRunner.query(`DROP INDEX "IDX_32fcc15b1ad811a5eee70a0601"`);
        await queryRunner.query(`DROP INDEX "IDX_2bd583e5c40df70b13417be88b"`);
        await queryRunner.query(`DROP TABLE "tests_testers_users"`);
        await queryRunner.query(`ALTER TABLE "tests" ADD CONSTRAINT "FK_22e8c3851ca66823b5a2d2b3218" FOREIGN KEY ("tester_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
