import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNewUserRoles1601309052837 implements MigrationInterface {
    name = 'AddNewUserRoles1601309052837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE customers_subtype_enum RENAME VALUE 'INDIVIDUAL' TO 'FAMILY';`);
        await queryRunner.query(`ALTER TYPE users_roles_enum ADD VALUE 'DEVICE';`);
        await queryRunner.query(`ALTER TYPE users_roles_enum ADD VALUE 'VERIFIER';`);
    } 

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE customers_subtype_enum RENAME VALUE 'FAMILY' TO 'INDIVIDUAL';`);
        await queryRunner.query(`ALTER TYPE users_roles_enum REMOVE VALUE 'DEVICE';`);
        await queryRunner.query(`ALTER TYPE users_roles_enum REMOVE VALUE 'VERIFIER';`);
    }

}
