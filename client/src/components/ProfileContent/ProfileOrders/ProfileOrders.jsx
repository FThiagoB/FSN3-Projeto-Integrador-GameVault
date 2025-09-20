import React from "react";

const ProfileOrders = () => {
  const sampleOrders = [
    {
      id: "A7S8-D9F0-G1H2",
      date: "2023-11-15",
      status: "Delivered",
      total: "99.80",
      items: [
        {
          name: "The Legend of Zelda: Ocarina of Time",
          image: "https://placehold.co/100x100/312e81/fff?text=Zelda",
        },
        {
          name: "Super Mario 64",
          image: "https://placehold.co/100x100/be185d/fff?text=Mario",
        },
      ],
    },
    {
      id: "J3K4-L5M6-N7P8",
      date: "2023-10-22",
      status: "Shipped",
      total: "44.90",
      items: [
        {
          name: "Final Fantasy VII",
          image: "https://placehold.co/100x100/6b21a8/fff?text=FF7",
        },
      ],
    },
    {
      id: "Q9R0-S1T2-U3V4",
      date: "2023-09-05",
      status: "Processing",
      total: "125.70",
      items: [
        {
          name: "Chrono Trigger",
          image: "https://placehold.co/100x100/10b981/fff?text=Chrono",
        },
        {
          name: "Street Fighter II",
          image: "https://placehold.co/100x100/3b82f6/fff?text=SFII",
        },
        {
          name: "Donkey Kong Country",
          image: "https://placehold.co/100x100/f59e0b/fff?text=DK",
        },
      ],
    },
  ];
  return (
    <main className="profile-main-content">
      <h2 className="profile-orders-title">My Orders</h2>

      <div className="orders-list">
        {sampleOrders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <div className="order-info">
                <span className="label">Order ID: </span>
                <span>{order.id}</span>
              </div>
              <div className="order-info">
                <span className="label">Date: </span>
                <span>{order.date}</span>
              </div>
              <div className={`status-badge status-${order.status}`}>
                {order.status}
              </div>
            </div>
            <div className="order-card-body">
              <ul className="order-item-list">
                {order.items.map((item, index) => (
                  <li key={index} className="order-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="order-item-image"
                    />
                    <span className="order-item-name">{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-card-footer">
              <span className="order-total">Total: R$ {order.total}</span>
              <button className="profile-btn profile-btn-secondary">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ProfileOrders;
