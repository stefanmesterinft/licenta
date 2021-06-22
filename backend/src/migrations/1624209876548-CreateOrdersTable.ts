import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateOrdersTable1624209876548 implements MigrationInterface {
    name = 'CreateOrdersTable1624209876548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "orders_order_status_enum" AS ENUM('PLACED', 'CONFIRMED', 'SENT', 'DELIVERED', 'CANCELED')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "order_id" character varying NOT NULL, "product_code" character varying NOT NULL, "product_size" character varying NOT NULL, "quantity" integer NOT NULL, "order_status" "orders_order_status_enum" NOT NULL DEFAULT 'PLACED', "address" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "orders_order_status_enum"`);
    }

}
