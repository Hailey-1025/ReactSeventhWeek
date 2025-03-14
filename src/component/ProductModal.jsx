import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";

const { VITE_BASE_URL, VITE_API_URL } = import.meta.env;

function ProductModal({
  modalMode,
  tempProduct,
  isProductModalOpen,
  setIsProductModalOpen,
  getProducts,
}) {
  const [modalData, setModalData] = useState(tempProduct);
  const dispatch = useDispatch();

  useEffect(() => {
    setModalData({
      ...tempProduct,
    });
  }, [tempProduct]);

  const productModalRef = useRef(null);

  useEffect(() => {
    new Modal(productModalRef.current);
  }, []);

  useEffect(() => {
    if (isProductModalOpen) {
      const modalInstance = Modal.getInstance(productModalRef.current);
      modalInstance.show();
    }
  }, [isProductModalOpen]);

  // 關閉 modal
  const handleCloseProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
    setIsProductModalOpen(false);
  };

  const handleModalInputChange = (e) => {
    const { value, name, checked, type } = e.target;
    setModalData({
      ...modalData,
      [name]: type === "checked" ? checked : value,
    });
  };

  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...modalData.imagesUrl];
    newImages[index] = value;
    setModalData({
      ...modalData,
      imagesUrl: newImages,
    });
  };

  // 新增圖片
  const handleAddImage = () => {
    const newImages = [...modalData.imagesUrl, ""];
    setModalData({
      ...modalData,
      imagesUrl: newImages,
    });
  };
  // 刪除圖片
  const handleRemoveImage = () => {
    const newImages = [...modalData.imagesUrl];
    newImages.pop();
    setModalData({
      ...modalData,
      imagesUrl: newImages,
    });
  };

  const createProduct = async () => {
    try {
      await axios.post(
        `${VITE_BASE_URL}/v2/api/${VITE_API_URL}/admin/product`,
        {
          data: {
            ...modalData,
            origin_price: Number(modalData.origin_price),
            price: Number(modalData.price),
            is_enabled: modalData.is_enabled ? 1 : 0,
          },
        }
      );
    } catch (error) {
      // alert("新增產品失敗");
      const {message} = error.response.data
      dispatch(
        pushMessage({
          text: message.join("、"),
          status: "failed",
        })
      );
    }
  };

  const updateProduct = async () => {
    try {
      await axios.put(
        `${VITE_BASE_URL}/v2/api/${VITE_API_URL}/admin/product/${modalData.id}`,
        {
          data: {
            ...modalData,
            origin_price: Number(modalData.origin_price),
            price: Number(modalData.price),
            is_enabled: modalData.is_enabled ? 1 : 0,
          },
        }
      );
      dispatch(
        pushMessage({
          text: '編輯產品成功',
          status: "success",
        })
      );
    } catch (error) {
      alert("編輯產品失敗");
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const apiCall = modalMode === "create" ? createProduct : updateProduct;
      await apiCall();
      getProducts();
      handleCloseProductModal();
    } catch (error) {
      alert("更新產品失敗");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file-to-upload", file);

    try {
      const res = await axios.post(
        `${VITE_BASE_URL}/v2/api/${VITE_API_URL}/admin/upload`,
        formData
      );
      const uploadedImageUrl = res.data.imageUrl;
      setModalData({
        ...modalData,
        imageUrl: uploadedImageUrl,
      });
    } catch (error) {
      alert("檔案格式錯誤");
    }
  };

  return (
    <div
      ref={productModalRef}
      id="productModal"
      className="modal"
      style={{ backgroundColor: "rgba(0,0,0,0,5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fs-4">
              {modalMode === "create" ? "新增產品" : "編輯產品"}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleCloseProductModal}
            ></button>
          </div>
          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-md-4">
                {/* 圖片上傳 */}
                <div className="mb-5">
                  <label htmlFor="fileInput" className="form-label">
                    {" "}
                    圖片上傳{" "}
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="form-control"
                    id="fileInput"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="primary-image" className="form-label">
                    主圖
                  </label>
                  <div className="input-group">
                    <input
                      value={modalData.imageUrl}
                      onChange={handleModalInputChange}
                      type="text"
                      name="imageUrl"
                      id="primary-image"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                    />
                  </div>
                  <img
                    src={modalData.imageUrl}
                    alt={modalData.title}
                    className="img-fluid"
                  />
                </div>

                {/* 副圖 */}
                <div className="border border-2 border-dashed rounded-3 p-3">
                  {modalData.imagesUrl?.map((image, index) => (
                    <div key={index} className="mb-2">
                      <label
                        htmlFor={`imagesUrl-${index + 1}`}
                        className="form-label"
                      >
                        副圖 {index + 1}
                      </label>
                      <input
                        value={image}
                        onChange={(e) => {
                          handleImageChange(e, index);
                        }}
                        type="text"
                        id={`imagesUrl-${index + 1}`}
                        placeholder={`圖片網址 ${index + 1}`}
                        className="form-control mb-2"
                      />
                      {image && (
                        <img
                          src={image}
                          alt={`副圖 ${index + 1}`}
                          className="img-fluid mb-2"
                        />
                      )}
                    </div>
                  ))}
                  <div className="btn-group w-100">
                    {modalData.imagesUrl.length < 5 &&
                      modalData.imagesUrl[modalData.imagesUrl.length - 1] !==
                        "" && (
                        <button
                          onClick={handleAddImage}
                          type="button"
                          className="btn btn-outline-primary btn-sm w-100"
                        >
                          新增圖片
                        </button>
                      )}
                    {modalData.imagesUrl.length > 1 && (
                      <button
                        onClick={handleRemoveImage}
                        type="button"
                        className="btn btn-outline-danger btn-sm w-100"
                      >
                        取消圖片
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    標題
                  </label>
                  <input
                    value={modalData.title}
                    onChange={handleModalInputChange}
                    type="text"
                    name="title"
                    id="title"
                    className="form-control"
                    placeholder="請輸入標題"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    分類
                  </label>
                  <input
                    value={modalData.category}
                    onChange={handleModalInputChange}
                    type="text"
                    name="category"
                    id="category"
                    className="form-control"
                    placeholder="請輸入分類"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="unit" className="form-label">
                    單位
                  </label>
                  <input
                    value={modalData.unit}
                    onChange={handleModalInputChange}
                    type="text"
                    name="unit"
                    id="unit"
                    className="form-control"
                    placeholder="請輸入單位"
                  />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label htmlFor="origin_price" className="form-label">
                      原價
                    </label>
                    <input
                      value={modalData.origin_price}
                      onChange={handleModalInputChange}
                      type="number"
                      name="origin_price"
                      id="origin_price"
                      className="form-control"
                      placeholder="請輸入原價"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <input
                      value={modalData.price}
                      onChange={handleModalInputChange}
                      type="number"
                      name="price"
                      id="price"
                      className="form-control"
                      placeholder="請輸入售價"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    產品描述
                  </label>
                  <textarea
                    value={modalData.description}
                    onChange={handleModalInputChange}
                    name="description"
                    id="description"
                    className="form-control"
                    rows={4}
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    說明內容
                  </label>
                  <textarea
                    value={modalData.content}
                    onChange={handleModalInputChange}
                    name="content"
                    id="content"
                    className="form-control"
                    row={4}
                    placeholder="請輸入說明內容"
                  ></textarea>
                </div>
                <div className="form-check">
                  <input
                    checked={modalData.is_enabled}
                    onChange={handleModalInputChange}
                    type="checkbox"
                    name="is_enabled"
                    className="form-check-input"
                    id="isEnabled"
                  />
                  <label htmlFor="isEnabled" className="form-check-label">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer border-top bg-light">
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleCloseProductModal}
            >
              取消
            </button>
            <button
              onClick={handleUpdateProduct}
              type="button"
              className="btn btn-primary"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
