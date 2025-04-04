import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Image, message, Table } from "antd";
import { useEffect, useState } from "react";
import api from "../components/Api";
import ProductDrawer from "../components/ProductDrawer";
import { CategoriesType, ProductlarType } from "../types/type";

function Productlar() {
  const [productlar, setProductlar] = useState<ProductlarType>([]);
  const [category, setCategory] = useState<CategoriesType>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Object>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const users = () => {
    setLoading(true);
    api
      .get("/api/products?order=ASC")
      .then((response) => {
        setProductlar(response.data.items);
      })
      .finally(() => {
        setLoading(false);
      });

    api
      .get("/api/categories?order=ASC")
      .then((response) => {
        setCategory(response.data.items);
        console.log(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    users();
  }, []);

  function onDeleted(id: number) {
    api
      .delete(`/api/products/${id}`)
      .then(() => {
        message.success("Mahsulot muvaffaqiyatli o'chirildi");
        setProductlar((prev) => prev.filter((item) => item.id !== id));
      })
      .catch(() => {
        message.error("O'chirishda xatolik yuz berdi");
      });
  }

  return (
    <div className="p-6 w-full h-[640px] border-b border-b-gray-300 bg-white rounded-lg overflow-y-auto">
      <ProductDrawer
        nomi="Productlar"
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
            title: "Price",
            dataIndex: "price",
            key: "price",
          },
          {
            title: "categoryId",
            dataIndex: "categoryId",
            key: "categoryId",
            render: (id) => {
              const nomini_chiqarish = category.find((item) => item.id === id);
              return <p>{nomini_chiqarish?.name}</p>;
            },
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
            dataIndex: "imageUrl",
            key: "imageUrl",
            render: (imageUrl) => {
              return (
                <div>
                  <Image
                    width={70}
                    height={50}
                    src={imageUrl}
                    placeholder={
                      <Image preview={false} src={imageUrl} width={200} />
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
        dataSource={productlar}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="w-full"
      />
    </div>
  );
}

export default Productlar;
