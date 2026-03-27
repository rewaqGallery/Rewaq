import { useState } from "react";
import "../Style/managerTable.css";
export default function ProductsTable({
  products,
  onEdit,
  onDelete,
  toggleFeatures,
  updateQuantity,
}) {
  const [quantities, setQuantities] = useState({});
  if (products.length === 0) {
    return <p>No products found</p>;
  }

  return (
    <table className="manager-table">
      <thead>
        <tr>
          <th className="code-th" scope="col">
            code
          </th>
          <th className="quantity-th" scope="col">
            quantity
          </th>
          <th className="sold-th" scope="col">
            sold
          </th>
          <th className="price-th" scope="col">
            price
          </th>
          <th className="category-th" scope="col">
            category
          </th>
          <th className="tag-th" scope="col">
            Tags
          </th>
          <th className="actions-th">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p._id}>
            <td className="code-td">{p.code}</td>
            <td className="quantity-td">
              <input
                type="number"
                value={quantities[p._id] ?? p.quantity}
                onChange={(e) => {
                  const value = Math.max(0, Number(e.target.value));
                  setQuantities((prev) => ({
                    ...prev,
                    [p._id]: value,
                  }));
                }}
              />
            </td>
            <td className="sold-td">{p.sold}</td>
            <td className="price-td">
              {p.priceAfterDiscount === undefined || p.priceAfterDiscount == ""
                ? p.price
                : `${p.price} -> ${p.priceAfterDiscount}`}
            </td>
            <td className="category-td">{p.category?.name}</td>
            <td className="tag-td">
              <div className="tag-content">{p.tagsText}</div>
            </td>
            <td className="actions-td">
              <div className="buttons">
                <button
                  onClick={() => onEdit(p)}
                  aria-label={`Edit Product ${p.description}`}
                >
                  Edit
                </button>
                <button
                  className={p?.featured ? "active" : ""}
                  style={
                    p?.featured
                      ? { backgroundColor: "#caaa70" }
                      : { backgroundColor: "#569375" }
                  }
                  onClick={() => toggleFeatures(p._id)}
                  aria-label={`toggle featured for Product ${p.description}`}
                >
                  Featured
                </button>
                <button
                  className="danger"
                  onClick={() => onDelete(p._id)}
                  aria-label={`Delete product ${p.description}`}
                >
                  Delete
                </button>
                <button
                  className="large-btn"
                  disabled={(quantities[p._id] ?? p.quantity) === p.quantity}
                  onClick={() => {
                    updateQuantity(p._id, quantities[p._id] ?? p.quantity);

                    // clear local state
                    setQuantities((prev) => {
                      const newState = { ...prev };
                      delete newState[p._id];
                      return newState;
                    });
                  }}
                >
                  Update
                  <br />
                  Quantity
                </button>{" "}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
