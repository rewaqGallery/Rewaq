
import React, { useEffect, useState } from "react";
import {
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  cancelOrder,
  deleteOrder,
} from "../../services/orderService";
import Pagination from "./Pagination";

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({ keyword: "", page: 1, limit: 5, sort: "-createdAt" });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const res = await getOrders(`?${params.toString()}`);
      setOrders(res.data);
      setTotalResults(res.totalResults);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleAction = async (id, action) => {
    if (action === "paid") await updateOrderToPaid(id);
    if (action === "delivered") await updateOrderToDelivered(id);
    if (action === "cancel") await cancelOrder(id);
    if (action === "delete") await deleteOrder(id);
    fetchOrders();
  };

  return (
    <div>
      <h2>Manage Orders</h2>
      <div className="filter-sort">
        <input
          type="text"
          placeholder="Search by ID or User..."
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value, page: 1 })}
        />
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
        </select>
      </div>

      {loading ? <p>Loading...</p> : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o._id}</td>
                  <td>{o.user}</td>
                  <td>${o.totalOrderPrice}</td>
                  <td>{o.orderStatus}</td>
                  <td>
                    {!o.isPaid && <button onClick={() => handleAction(o._id, "paid")}>Mark Paid</button>}
                    {!o.isDelivered && <button onClick={() => handleAction(o._id, "delivered")}>Mark Delivered</button>}
                    {!o.isCanceled && <button className="danger" onClick={() => handleAction(o._id, "cancel")}>Cancel</button>}
                    <button className="danger" onClick={() => handleAction(o._id, "delete")}>Delete</button>
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
