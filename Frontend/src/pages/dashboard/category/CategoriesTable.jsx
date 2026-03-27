import "../Style/managerTable.css";
export default function CategoriesTable({ categories, onEdit, onDelete }) {
  if (categories.length === 0) {
    return <p>No categories found</p>;
  }

  return (
    <table className="manager-table">
      <thead>
        <tr>
          <th className="category-name-th" scope="col">
            Name
          </th>
          <th className="category-description-th" scope="col">
            Description
          </th>
          <th className="category-price-th" scope="col">
            Price
          </th>
          {/* <th scope="col">Image</th> */}
          <th className="category-actions-th" scope="col">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {categories.map((c) => (
          <tr key={c._id}>
            <td className="category-name-td">{c.name}</td>
            <td className="category-description-td">
              <div className="description-content">{c.description}</div>
            </td>
            <td className="category-price-td">
              {c.priceAfterDiscount === undefined || c.priceAfterDiscount == ""
                ? c.price
                : `${c.price} -> ${c.priceAfterDiscount}`}
            </td>
            {/* <td>
              <img
                src={c.image?.url}
                alt={c.name ? `${c.name} category image` : "Category image"}
                loading="lazy"
              />
            </td> */}
            <td className="category-actions-td">
              <div className="buttons">
                <button
                  onClick={() => onEdit(c)}
                  aria-label={`Edit category ${c.name}`}
                >
                  Edit
                </button>
                <button
                  className="danger"
                  onClick={() => onDelete(c._id)}
                  aria-label={`Delete category ${c.name}`}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
