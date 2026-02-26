export default function CategoriesTable({ categories, onEdit, onDelete }) {
  if (categories.length === 0) {
    return <p>No categories found</p>;
  }

  return (
    <table className="manager-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Image</th>
          <th style={{ width: "180px" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((c) => (
          <tr key={c._id}>
            <td>{c.name}</td>
            <td>{c.description}</td>
            <td>{c.price}</td>
            <td>
              <img src={c.image?.url} />
            </td>
            <td>
              <button onClick={() => onEdit(c)}>Edit</button>
              <button className="danger" onClick={() => onDelete(c._id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
