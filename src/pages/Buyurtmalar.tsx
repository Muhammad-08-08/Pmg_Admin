import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, message, Table } from "antd";
import { useEffect, useState } from "react";
import api from "../components/Api";
import OrdersDrawer from "../components/OrdersDrawer";
import {
  BuyurtmalarItemType,
  BuyurtmalarType,
  MijozlarType,
  OrderProduct,
} from "../types/type";

function Buyurtmalar() {
  const [buyurtmalar, setBuyurtmalar] = useState<BuyurtmalarType | null>(null);
  const [mijozlar, setMijozlar] = useState<MijozlarType>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<BuyurtmalarItemType | null>(
    null
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const fetchBuyurtmalar = () => {
    setLoading(true);
    api
      .get("/api/orders?order=ASC")
      .then((response) => {
        setBuyurtmalar(response.data);
      })
      .finally(() => setLoading(false));

    api
      .get("/api/users?order=ASC")
      .then((response) => {
        setMijozlar(response.data.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBuyurtmalar();
  }, []);

  const onDeleted = (id: number) => {
    api
      .delete(`/api/orders/${id}`)
      .then(() => {
        message.success("Buyurtma muvaffaqiyatli o‘chirildi");
        setBuyurtmalar((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.filter((item) => item.id !== id),
          };
        });
      })
      .catch(() => {
        message.error("O‘chirishda xatolik yuz berdi");
      });
  };

  return (
    <div className="p-6 w-full h-[640px] border-b border-b-gray-300 bg-white rounded-lg overflow-y-auto">
      <OrdersDrawer
        nomi="Buyurtmalar"
        editItem={selectedUser}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        refresh={fetchBuyurtmalar}
      />

      <Table
        dataSource={buyurtmalar?.items || []}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
        className="w-full"
        columns={[
          {
            title: "ID",
            dataIndex: "id",
            key: "id",
          },
          {
            title: "Mijoz ID",
            dataIndex: "customerId",
            key: "customerId",
            render: (id) => {
              const new_arr = mijozlar.find((item) => item.id === id);
              return <p>{new_arr?.name}</p>;
            },
          },
          {
            title: "Mahsulotlar",
            dataIndex: "items",
            key: "products",
            render: (items: OrderProduct[]) => {
              return (
                <ul>
                  {items.map((item, idx) => (
                    <li key={idx}>{item.price.toLocaleString("ru")} so‘m</li>
                  ))}
                </ul>
              );
            },
          },
          {
            title: "Jami narx",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (price: number) => `${price.toLocaleString("ru")} so'm`,
          },
          {
            title: "Vaqti",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (value: string) => {
              const date = new Date(value);
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = date.getFullYear();
              return `${day}.${month}.${year}`;
            },
          },
          {
            title: "Holati",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
              const colors: Record<string, string> = {
                pending: "text-yellow-600",
                processing: "text-blue-600",
                delivered: "text-green-600",
                cancelled: "text-red-600",
              };
              return (
                <span
                  className={`font-semibold ${
                    colors[status] || "text-gray-500"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              );
            },
          },
          {
            title: "Amallar",
            key: "actions",
            render: (_, record: BuyurtmalarItemType) => (
              <div className="flex gap-2 items-center">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setSelectedUser(record);
                    setIsOpen(true);
                  }}
                />
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => onDeleted(record.id)}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

export default Buyurtmalar;
