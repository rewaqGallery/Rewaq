import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/userService";
import Pagination from "./Pagination";

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({ keyword: "", page: 1, limit: 5, sort: "-createdAt" });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // const params = new URLSearchParams(filters);
      // const res = await getUsers(`?${params.toString()}`);
      const res = await getUsers(filters);

      setUsers(res.data);
      setTotalResults(res.totalResults);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await deleteUser(id);
    fetchUsers();
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <div className="filter-sort">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value, page: 1 })}
        />
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="name">Name A-Z</option>
          <option value="-name">Name Z-A</option>
        </select>
      </div>

      {loading ? <p>Loading...</p> : (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button className="danger" onClick={() => handleDelete(u._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            page={filters.page}
            setPage={(p) => setFilters({ ...filters, page: p })}
            totalResults={totalResults}
            limit={filters.limit}
          />
        </>
      )}
    </div>
  );
}
