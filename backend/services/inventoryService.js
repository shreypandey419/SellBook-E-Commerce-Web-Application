import Book from "../models/bookModel.js";

const quantityFor = (item) => Number(item.quantity || 1);
const bookIdFor = (item) => item.book || item.id || item._id;

const normalizeLegacyStock = async (bookId) => {
  await Book.updateOne(
    { _id: bookId, stock: { $exists: false }, stockQuantity: { $exists: true } },
    [{ $set: { stock: "$stockQuantity" } }]
  );
};

export const ensureInventory = async (items) => {
  for (const item of items) {
    await normalizeLegacyStock(bookIdFor(item));
    const book = await Book.findById(bookIdFor(item)).select("stock stockQuantity");
    const available = Number(book?.stock ?? book?.stockQuantity ?? 0);
    if (!book || available < quantityFor(item)) throw new Error("One or more books are unavailable in the requested quantity.");
  }
};

export const reduceInventory = async (order) => {
  if (order.inventoryAdjusted) return;
  await ensureInventory(order.books);
  for (const item of order.books) {
    const quantity = quantityFor(item);
    const book = await Book.findOneAndUpdate(
      { _id: bookIdFor(item), stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { new: true }
    );
    if (!book || available < quantityFor(item)) {
      const error = new Error(
        "One or more books are unavailable in the requested quantity."
      );

      error.statusCode = 409;

      throw error;
    }
  }
  order.inventoryAdjusted = true;
  await order.save();
};

export const restoreInventory = async (order) => {
  if (!order.inventoryAdjusted) return;
  for (const item of order.books) {
    const quantity = quantityFor(item);
    await Book.findByIdAndUpdate(bookIdFor(item), { $inc: { stock: quantity } });
  }
  order.inventoryAdjusted = false;
  await order.save();
};
