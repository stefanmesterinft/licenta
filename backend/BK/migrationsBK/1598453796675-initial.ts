import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1598453796675 implements MigrationInterface {
    name = 'initial1598453796675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "FK_cce90811a9e65e2c51357a0fbbd"`);
        await queryRunner.query(`ALTER TABLE "devices" RENAME COLUMN "owner_id" TO "customer_id"`);
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "FK_abf5045e1ff3c852a53611c726a" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "FK_abf5045e1ff3c852a53611c726a"`);
        await queryRunner.query(`ALTER TABLE "devices" RENAME COLUMN "customer_id" TO "owner_id"`);
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "FK_cce90811a9e65e2c51357a0fbbd" FOREIGN KEY ("owner_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
