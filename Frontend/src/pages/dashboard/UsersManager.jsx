import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/userService";
import Pagination from "../../components/Pagination";
import "./Style/Managers.css";
import "./Style/managerTable.css";

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  const [filters, setFilters] = useState({
    keyword: "",
    page: 1,
    limit: 25,
    sort: "-createdAt",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // const params = new URLSearchParams(filters);
      // const res = await getUsers(?${params.toString()});
      const res = await getUsers(filters);
      setUsers(res.data);
      setTotalResults(res.totalResults);
    } catch (err) {
      console.log(err);
      setError("Failed to load users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    await deleteUser(id);
    fetchUsers();
  };

  return (
    <section className="manager">
      <div className="manager-header">
        <h2>Manage Users</h2>
      </div>

      <div className="filter-sort">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filters.keyword}
          onChange={(e) =>
            setFilters({ ...filters, keyword: e.target.value, page: 1 })
          }
          aria-label="Search users by name or email"
        />

        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          aria-label="Sort users"
        >
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="name">Name A-Z</option>
          <option value="-name">Name Z-A</option>
        </select>
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status" aria-live="polite">
          Loading...
        </p>
      ) : (
        <>
          {users.length === 0 ? (
            <p>No Users found</p>
          ) : (
            <table className="manager-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                  <th scope="col" >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <button
                        className="danger"
                        onClick={() => handleDelete(u._id, u.name)}
                        aria-label={`Delete user ${u.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Pagination
            page={filters.page}
            setPage={(p) => setFilters({ ...filters, page: p })}
            totalResults={totalResults}
            limit={filters.limit}
          />
        </>
      )}
    </section>
  );
}
