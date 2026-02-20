export default function ProductsTable({
  products,
  onEdit,
  onDelete,
  toggleFeatures,
}) {
  if (products.length === 0) {
    return <p>No products found</p>;
  }

  return (
    <table className="manager-table">
      <thead>
        <tr>
          <th>code</th>
          <th>quantity</th>
          <th>sold</th>
          <th>price</th>
          <th>category</th>
          <th>Tags</th>
          <th style={{ width: "180px" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p._id}>
            <td>{p.code}</td>
            <td>{p.quantity}</td>
            <td>{p.sold}</td>
            <td>{p.price}</td>
            <td>{p.category?.name}</td>
            <td>{p.tagsText}</td>
            {/* <td>
              <img src={p.imageCover?.url} />
            </td> */}
            <td className="buttons" style={{ display: "flex" }}>
              <button onClick={() => onEdit(p)}>Edit</button>
              <button
                className={p?.featured ? "active" : ""}
                style={
                  p?.featured
                    ? { backgroundColor: "#caaa70" }
                    : { backgroundColor: "#569375" }
                }
                onClick={() => toggleFeatures(p._id)}
              >
                Featured
              </button>

              <button className="danger" onClick={() => onDelete(p._id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
