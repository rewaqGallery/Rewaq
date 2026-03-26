import "../Style/managerTable.css"
export default function CategoriesTable({ categories, onEdit, onDelete }) {
  if (categories.length === 0) {
    return <p>No categories found</p>;
  }

  return (
    <table className="manager-table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
          <th scope="col">Price</th>
          <th scope="col">PriceAfterDiscount</th>
          <th scope="col">Image</th>
          <th scope="col">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {categories.map((c) => (
          <tr key={c._id}>
            <td>{c.name}</td>
            <td>{c.description}</td>
            <td>{c.price}</td>
            <td>{c.priceAfterDiscount}</td>
            <td>
              <img
                src={c.image?.url}
                alt={c.name ? `${c.name} category image` : "Category image"}
                loading="lazy"
              />
            </td>
            <td>
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
