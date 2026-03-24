import React, { useEffect, useState } from "react";
import {
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  cancelOrder,
  deleteOrder,
} from "../../services/orderService";
import Pagination from "../../components/Pagination";
import "./Style/Managers.css";
import "./Style/managerTable.css"

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  const [filters, setFilters] = useState({
    keyword: "",
    page: 1,
    limit: 5,
    sort: "-createdAt",
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders(filters);
      setOrders(res.data);
      setTotalResults(res.totalResults);
    } catch (err) {
      console.log(err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
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
    <section className="manager">
      <div className="manager-header">
        <h2>Manage Orders</h2>
      </div>
      <div className="filter-sort">
        <input
          type="text"
          placeholder="Search by ID or User..."
          value={filters.keyword}
          onChange={(e) =>
            setFilters({ ...filters, keyword: e.target.value, page: 1 })
          }
          aria-label="Search orders by ID or user"
        />
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          aria-label="Sort orders"
        >
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="orderStatus">Status ASC</option>
          <option value="-orderStatus">Status DSC</option>
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
          {orders.length === 0 ? (
            <p>No Orders found</p>
          ) : (
            <table className="manager-table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">User</th>
                  <th scope="col">Total</th>
                  <th scope="col">Status</th>
                  <th scope="col" >
                    Actions
                  </th>
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
                      {!o.isPaid && (
                        <button
                          onClick={() => handleAction(o._id, "paid")}
                          aria-label={`Mark order ${o._id} as paid`}
                        >
                          Mark Paid
                        </button>
                      )}
                      {!o.isDelivered && (
                        <button
                          onClick={() => handleAction(o._id, "delivered")}
                          aria-label={`Mark order ${o._id} as delivered`}
                        >
                          Mark Delivered
                        </button>
                      )}
                      {!o.isCanceled && (
                        <button
                          className="danger"
                          onClick={() => handleAction(o._id, "cancel")}
                          aria-label={`Cancel order ${o._id}`}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        className="danger"
                        onClick={() => handleAction(o._id, "delete")}
                        aria-label={`Delete order ${o._id}`}
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
