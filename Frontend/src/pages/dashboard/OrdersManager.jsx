import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  cancelOrder,
  deleteOrder,
  getOrderById,
} from "../../services/orderService";
import Pagination from "../../components/Pagination";
import "./Style/Managers.css";
import "./Style/managerTable.css";
import { governorates } from "./../../utils/governorates";

export default function OrdersManager() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  const [filters, setFilters] = useState({
    keyword: "",
    page: 1,
    limit: 25,
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
                  <th className="order-id-th" scope="col">
                    ID
                  </th>
                  <th className="order-user-th" scope="col">
                    User
                  </th>
                  <th className="order-governorate-th" scope="col">
                    Governorate
                  </th>
                  <th className="order-ship-th" scope="col">
                    ship
                  </th>
                  <th className="order-total-th" scope="col">
                    Total
                  </th>
                  <th className="order-status-th" scope="col">
                    Status
                  </th>
                  <th className="order-actions-th" scope="col">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td className="order-id-td">
                      {o._id.toString().slice(0, 7)}..
                    </td>
                    <td className="order-user-td">
                      {o._id.toString().slice(0, 7)}..
                    </td>
                    <td className="order-governorate-td">
                      {o?.shippingAddress?.governorate}
                    </td>
                    <td className="order-ship-td">{o.shippingPrice}</td>
                    <td className="order-total-td">{o.totalOrderPrice}</td>
                    <td className="order-status-td">{o.orderStatus}</td>
                    <td className="order-actions-td">
                      <div className="buttons orders-buttons">
                        <button
                          onClick={() => navigate(`/order/${o._id}`)}
                          aria-label="View Order"
                        >
                          View
                        </button>

                        {!o.isPaid && (
                          <button
                            className="paidBtn"
                            onClick={() => handleAction(o._id, "paid")}
                            aria-label={`Mark order ${o._id} as paid`}
                          >
                            Mark Paid
                          </button>
                        )}
                        {!o.isDelivered && (
                          <button
                            className="deliveredBtn"
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
                      </div>
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
