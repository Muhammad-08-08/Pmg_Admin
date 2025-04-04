import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Image, message, Table } from "antd";
import { useEffect, useState } from "react";
import api from "../components/Api";
import DrawerPage from "../components/UserDrawerPage";
import useMyStore from "../store/my-store";
import { MijozlarType } from "../types/type";

function Mijozlar() {
  const state = useMyStore();
  const [mijozlar, setMijozlar] = useState<MijozlarType>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Object>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const users = () => {
    setLoading(true);
    api
      .get("/api/users?order=ASC")
      .then((response) => {
        setMijozlar(response.data.items);
      })
      .catch((error) => {
        if (error.status === 401) {
          state.logout();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    users();
  }, []);

  function onDeleted(id: number) {
    const user = mijozlar.find((item) => item.id === id);

    if (user?.role === "admin") {
      return message.error("Admin foydalanuvchini o'chirish mumkin emas");
    }

    api
      .delete(`/api/users/${id}`)
      .then(() => {
        message.success("Mijoz muvaffaqiyatli o'chirildi");
        setMijozlar((prev) => prev.filter((item) => item.id !== id));
      })
      .catch(() => {
        message.error("O'chirishda xatolik yuz berdi");
      });
  }

  return (
    <div className="p-6 w-full h-[640px] border-b border-b-gray-300 bg-white rounded-lg overflow-y-auto">
      <DrawerPage
        nomi="Mijozlar"
        editItem={selectedUser}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        refresh={users}
      />
      <Table
        loading={loading}
        columns={[
          {
            title: "ID",
            dataIndex: "id",
            key: "id",
          },
          {
            title: "Ism",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
          },
          {
            title: "Roli",
            dataIndex: "role",
            key: "role",
          },
          {
            title: "Yaratilgan sana",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (item: string) => {
              const date = new Date(item);
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = date.getFullYear();
              return `${day}.${month}.${year}`;
            },
          },
          {
            title: "image",
            dataIndex: "image",
            key: "image",
            render: (image) => {
              return (
                <div>
                  <Image
                    width={70}
                    height={50}
                    src={image}
                    placeholder={
                      <Image preview={false} src={image} width={200} />
                    }
                  />
                </div>
              );
            },
          },
          {
            title: "Boshqalar",
            dataIndex: "id",
            key: "id",
            render: (id: number, rent) => {
              return (
                <div className="flex gap-2 items-center">
                  <Button
                    onClick={() => {
                      setSelectedUser(rent);
                      setIsOpen(true);
                    }}
                  >
                    <EditOutlined />
                  </Button>
                  <Button onClick={() => onDeleted(id)} danger>
                    <DeleteOutlined />
                  </Button>
                </div>
              );
            },
          },
        ]}
        dataSource={mijozlar}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="w-full"
      />
    </div>
  );
}

export default Mijozlar;
