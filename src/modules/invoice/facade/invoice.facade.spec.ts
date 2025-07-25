import { Sequelize } from "sequelize-typescript";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import { InvoiceItemModel, InvoiceModel } from "../repository/invoice.model";

describe("Invoice Facade test", () => {
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
    const facade = InvoiceFacadeFactory.create();

    const input = {
      name: "Invoice 1",
      document: "Document 1",
      street: "Street 1",
      number: "123",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "12345-678",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
        {
          id: "2",
          name: "Item 2",
          price: 200,
        },
      ],
    };

    const output = await facade.generate(input);

    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.document).toBe(input.document);
    expect(output.street).toBe(input.street);
    expect(output.number).toBe(input.number);
    expect(output.complement).toBe(input.complement);
    expect(output.city).toBe(input.city);
    expect(output.state).toBe(input.state);
    expect(output.zipCode).toBe(input.zipCode);
    expect(output.items).toHaveLength(2);
    expect(output.items[0].id).toBe(input.items[0].id);
    expect(output.items[0].name).toBe(input.items[0].name);
    expect(output.items[0].price).toBe(input.items[0].price);
    expect(output.items[1].id).toBe(input.items[1].id);
    expect(output.items[1].name).toBe(input.items[1].name);
    expect(output.items[1].price).toBe(input.items[1].price);
    expect(output.total).toBe(300);
  });

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
      name: "Invoice 1",
      document: "Document 1",
      street: "Street 1",
      number: "123",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "12345-678",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
        {
          id: "2",
          name: "Item 2",
          price: 200,
        },
      ],
    };

    const output = await facade.generate(input);

    const invoiceFound = await facade.find({ id: output.id });

    expect(invoiceFound.id).toBe(output.id);
    expect(invoiceFound.name).toBe(output.name);
    expect(invoiceFound.document).toBe(output.document);
    expect(invoiceFound.address.street).toBe(output.street);
    expect(invoiceFound.address.number).toBe(output.number);
    expect(invoiceFound.address.complement).toBe(output.complement);
    expect(invoiceFound.address.city).toBe(output.city);
    expect(invoiceFound.address.state).toBe(output.state);
    expect(invoiceFound.address.zipCode).toBe(output.zipCode);
    expect(invoiceFound.items).toHaveLength(2);
    expect(invoiceFound.items[0].id).toBe(output.items[0].id);
    expect(invoiceFound.items[0].name).toBe(output.items[0].name);
    expect(invoiceFound.items[0].price).toBe(output.items[0].price);
    expect(invoiceFound.items[1].id).toBe(output.items[1].id);
    expect(invoiceFound.items[1].name).toBe(output.items[1].name);
    expect(invoiceFound.items[1].price).toBe(output.items[1].price);
    expect(invoiceFound.total).toBe(300);
  });
});