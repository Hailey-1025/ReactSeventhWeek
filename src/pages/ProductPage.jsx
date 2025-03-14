import { useEffect, useState } from "react";
import axios from "axios";

import Pagination from "../component/Pagination";
import ProductModal from "../component/ProductModal";
import DelProductModal from "../component/DelProductModal";
import Toast from "../component/Toast";

const { VITE_BASE_URL, VITE_API_URL } = import.meta.env;

const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""],
};

function ProductPage({setIsAuth}) {
  const [products, setProducts] = useState([]);
  const [modalMode, setModalMode] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);

  // 登出
  const handleLogout = async () => {
    try {
      await axios.post(`${VITE_BASE_URL}/v2/logout`);
      setIsAuth(false);
    } catch (error) {
      alert("登出失敗");
    }
  };

  // 取得產品資料
  const getProducts = async (page = 1) => {
    try {
      const productList = await axios.get(
        `${VITE_BASE_URL}/v2/api/${VITE_API_URL}/admin/products?page=${page}`
      );
      setProducts(productList.data.products);
      setPageInfo(productList.data.pagination);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // 開啟 modal
  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);
    switch (mode) {
      case "create":
        setTempProduct(defaultModalState);
        break;
      case "edit":
        setTempProduct(product);
        break;
      default:
        break;
    }

    setIsProductModalOpen(true);
  };

  // 開啟刪除 modal
  const handleOpenDelProductModal = (product) => {
    setTempProduct(product);
    setIsDelProductModalOpen(true);
  };

  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const [pageInfo, setPageInfo] = useState({});

  const handlePageChange = (page) => {
    getProducts(page);
  };

  return (
    <>
      <div className="container py-5">
        <div className="row mb-3">
          <div className="justify-content-end">
            <button type="button" className="btn btn-secondary" onClick={handleLogout}>
              登出
            </button>
          </div>
        </div>
        <div className="row">
          {/* 產品頁面 */}
          <div className="col">
            <div className="d-flex justify-content-between mb-4">
              <h2>產品列表</h2>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleOpenProductModal("create");
                }}
              >
                建立新的產品
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>
                      {product.is_enabled ? (
                        <span className="text-success">啟用</span>
                      ) : (
                        <span>未啟用</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            handleOpenProductModal("edit", product);
                          }}
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleOpenDelProductModal(product)}
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 分頁 */}
          <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
        </div>
      </div>
      {/* modal */}
      <ProductModal
        modalMode={modalMode}
        tempProduct={tempProduct}
        isProductModalOpen={isProductModalOpen}
        setIsProductModalOpen={setIsProductModalOpen}
        getProducts={getProducts}
      />
      {/* 刪除產品modal */}
      <DelProductModal
        getProducts={getProducts}
        isOpen={isDelProductModalOpen}
        setIsOpen={setIsDelProductModalOpen}
        tempProduct={tempProduct}
      />

      <Toast />
    </>
  );
}

export default ProductPage;
