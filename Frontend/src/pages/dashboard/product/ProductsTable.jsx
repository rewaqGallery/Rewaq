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
          <th scope="col">code</th>
          <th scope="col">quantity</th>
          <th scope="col">sold</th>
          <th scope="col">price</th>
          <th scope="col">category</th>
          <th scope="col">Tags</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p._id}>
            <td>{p.code}</td>
            <td>
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
            <td>{p.sold}</td>
            <td>{p.price}</td>
            <td>{p.category?.name}</td>
            <td>{p.tagsText}</td>
            {/* <td>
              <img src={p.imageCover?.url} />
            </td> */}
            <td className="buttons">
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
                Update Quantity
              </button>{" "}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
