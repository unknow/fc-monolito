import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceItems from "../domain/invoice-items.entity";
import { InvoiceItemModel, InvoiceModel } from "./invoice.model";
import InvoiceRepository from "./invoice.repository";

describe("Invoice Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const invoiceProps = {
      id: new Id("1"),
      name: "Invoice 1",
      document: "Document 1",
      address: new Address(
        "Street 1",
        "123",
        "Complement 1",
        "City 1",
        "State 1",
        "12345-678"
      ),
      items: [
        new InvoiceItems({
          id: new Id("1"),
          name: "Item 1",
          price: 100,
        }),
        new InvoiceItems({
          id: new Id("2"),
          name: "Item 2",
          price: 200,
        }),
      ],
    };

    const invoice = new Invoice(invoiceProps);
    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: invoice.id.id },
      include: [{ model: InvoiceItemModel }],
    });

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.id).toBe(invoice.id.id);
    expect(invoiceDb.name).toBe(invoice.name);
    expect(invoiceDb.document).toBe(invoice.document);
    expect(invoiceDb.street).toBe(invoice.address.street);
    expect(invoiceDb.number).toBe(invoice.address.number);
    expect(invoiceDb.complement).toBe(invoice.address.complement);
    expect(invoiceDb.city).toBe(invoice.address.city);
    expect(invoiceDb.state).toBe(invoice.address.state);
    expect(invoiceDb.zipcode).toBe(invoice.address.zipCode);
    expect(invoiceDb.items).toHaveLength(2);
    expect(invoiceDb.items[0].id).toBe(invoice.items[0].id.id);
    expect(invoiceDb.items[0].name).toBe(invoice.items[0].name);
    expect(invoiceDb.items[0].price).toBe(invoice.items[0].price);
    expect(invoiceDb.items[1].id).toBe(invoice.items[1].id.id);
    expect(invoiceDb.items[1].name).toBe(invoice.items[1].name);
    expect(invoiceDb.items[1].price).toBe(invoice.items[1].price);
  });

  it("should find an invoice", async () => {
    const invoiceProps = {
      id: new Id("1"),
      name: "Invoice 1",
      document: "Document 1",
      address: new Address(
        "Street 1",
        "123",
        "Complement 1",
        "City 1",
        "State 1",
        "12345-678"
      ),
      items: [
        new InvoiceItems({
          id: new Id("1"),
          name: "Item 1",
          price: 100,
        }),
        new InvoiceItems({
          id: new Id("2"),
          name: "Item 2",
          price: 200,
        }),
      ],
    };

    const invoice = new Invoice(invoiceProps);
    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    const invoiceFound = await repository.find("1");

    expect(invoiceFound).toBeDefined();
    expect(invoiceFound.id.id).toBe(invoice.id.id);
    expect(invoiceFound.name).toBe(invoice.name);
    expect(invoiceFound.document).toBe(invoice.document);
    expect(invoiceFound.address.street).toBe(invoice.address.street);
    expect(invoiceFound.address.number).toBe(invoice.address.number);
    expect(invoiceFound.address.complement).toBe(invoice.address.complement);
    expect(invoiceFound.address.city).toBe(invoice.address.city);
    expect(invoiceFound.address.state).toBe(invoice.address.state);
    expect(invoiceFound.address.zipCode).toBe(invoice.address.zipCode);
    expect(invoiceFound.items).toHaveLength(2);
    expect(invoiceFound.items[0].id.id).toBe(invoice.items[0].id.id);
    expect(invoiceFound.items[0].name).toBe(invoice.items[0].name);
    expect(invoiceFound.items[0].price).toBe(invoice.items[0].price);
    expect(invoiceFound.items[1].id.id).toBe(invoice.items[1].id.id);
    expect(invoiceFound.items[1].name).toBe(invoice.items[1].name);
    expect(invoiceFound.items[1].price).toBe(invoice.items[1].price);
  });

  it("should throw an error when invoice is not found", async () => {
    const repository = new InvoiceRepository();

    await expect(repository.find("1")).rejects.toThrow("Invoice not found");
  });
});