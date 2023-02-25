import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import PaymentMethod from "./PaymentMethod";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import moment from "moment";
import React from "react";

const BillForm = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/products/all`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const validationSchema = Yup.object().shape({
    customerName: Yup.string(),
    customerPhone: Yup.string().matches(
      /^\d{10}$/,
      "Customer phone number must be 10 digits (no spaces or special characters)"
    ),
    customerAddress: Yup.string(),
    soldDate: Yup.date().required("Sold date is required"),
    payments: Yup.array()
      .of(
        Yup.object().shape({
          amount: Yup.number().required("Required"),
          method: Yup.string().required("Required"),
        })
      )
      .required("At least one payment is required"),
    products: Yup.array()
      .of(
        Yup.object().shape({
          productId: Yup.string().required("Product is required"),
          quantity: Yup.number()
            .required("Quantity is required")
            .min(1, "Quantity must be at least 1"),
        })
      )
      .required("At least one product is required"),
    totalPrice: Yup.number()
      .required("Total price is required")
      .min(1, "Total price must be at least 1"),
    billNumber: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      customerName: "",
      customerPhone: "",
      customerAddress: "",
      payments: [{ method: "CASH", amount: 0 }],
      products: [{ productId: "", quantity: "" }],
      dueAmount: 0,
      totalPrice: 0,
      comments: "",
      soldDate: moment().format("YYYY-MM-DD"),
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (
          values.payments.reduce((acc, item) => acc + item.amount, 0) !==
          values?.totalPrice
        ) {
          console.log("asdasdas");
        } else {
          let _products = [];
          for (let index = 0; index < values?.products.length; index++) {
            const product = values?.products[index];
            product.quantity =
              products?.find((e) => e?._id === product?.productId)?.units *
              product?.quantity;
            _products.push(product);
          }
          values.products = _products;
          const response = await axios.post(`/api/billing`, values, {
            headers: { Authorization: localStorage.getItem("token") },
          });
          alert("Success");
          formik.resetForm();
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const latestProduct = products?.sort((a, b) =>
    b.landingDate.localeCompare(a.landingDate)
  );

  function handleAddPaymentMethod() {
    formik.setFieldValue("payments", [
      ...formik.values?.payments,
      { name: "CASH", amount: 0 },
    ]);
  }

  const removePaymentMethod = (index) => {
    let newPaymentMethods = [...formik.values?.payments];
    newPaymentMethods = newPaymentMethods.filter((e, i) => i != index);
    formik.setFieldValue("payments", newPaymentMethods);
  };

  const removeProduct = (index) => {
    let newProducts = [...formik.values?.products];
    newProducts = newProducts.filter((e, i) => i != index);
    formik.setFieldValue("products", newProducts);
  };
  const handleAddProduct = () => {
    formik.setFieldValue("products", [
      ...formik.values.products,
      { productId: "", quantity: 0 },
    ]);
  };

  useEffect(() => {
    if (
      formik.values.products.length &&
      formik.values.products?.[0]?.quantity
    ) {
      let totalPrice = 0.0;
      for (let index = 0; index < formik.values.products.length; index++) {
        const element = formik.values.products[index];
        if (products?.find((e) => e?._id === element?.productId))
          totalPrice =
            totalPrice +
            products?.find((e) => e?._id === element?.productId)
              ?.billingPriceRetail *
              element?.quantity;
      }
      if (formik.values?.payments?.length === 1) {
        let payments = formik.values?.payments;
        payments[0].amount = totalPrice;
        formik.setFieldValue("payments", payments);
      }
      formik.setFieldValue("totalPrice", totalPrice);
    } else {
      if (formik.values?.payments?.length === 1) {
        let payments = formik.values?.payments;
        payments[0].amount = 0.0;
        formik.setFieldValue("payments", payments);
      }
      formik.setFieldValue("totalPrice", 0.0);
    }
  }, [formik?.values?.products]);

  const handleProductChange = (index, event) => {
    const { name, value } = event.target;
    const newProducts = [...formik.values.products];
    newProducts[index][name] = value;
    formik.setFieldValue("products", newProducts);
  };

  return (
    <div className="px-4 sm:px-8 mt-8 mb-8">
      <div className="md:flex md:items-center md:justify-between  mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Create a Bill
          </h2>
        </div>
      </div>{" "}
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="mr-2">
            <label
              htmlFor="customerName"
              className="block mb-1 font-medium text-gray-700"
            >
              Customer Name
            </label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              className={`w-full px-3 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:shadow-outline-blue ${
                formik.touched.customerName && formik.errors.customerName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={formik.values.customerName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.customerName && formik.errors.customerName ? (
              <div className="text-red-500">{formik.errors.customerName}</div>
            ) : null}
          </div>
          <div className="">
            <label
              htmlFor="customerPhone"
              className="block mb-1 font-medium text-gray-700"
            >
              Customer Phone
            </label>
            <input
              id="customerPhone"
              name="customerPhone"
              type="text"
              className={`w-full px-3 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:shadow-outline-blue ${
                formik.touched.customerPhone && formik.errors.customerPhone
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={formik.values.customerPhone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.customerPhone && formik.errors.customerPhone ? (
              <div className="text-red-500">{formik.errors.customerPhone}</div>
            ) : null}
          </div>
          <div className="">
            <label
              htmlFor="customerAddress"
              className="block mb-1 font-medium text-gray-700"
            >
              Customer Address
            </label>
            <input
              id="customerAddress"
              name="customerAddress"
              className={`w-full px-3 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:shadow-outline-blue ${
                formik.touched.customerAddress && formik.errors.customerAddress
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={formik.values.customerAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows="3"
            />
            {formik.touched.customerAddress && formik.errors.customerAddress ? (
              <div className="text-red-500">
                {formik.errors.customerAddress}
              </div>
            ) : null}
          </div>
          <div className="m">
            <label
              htmlFor="billNumber"
              className="block mb-1 font-medium text-gray-700"
            >
              Bill Number
            </label>
            <input
              id="billNumber"
              name="billNumber"
              type="text"
              className={`w-full px-3 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:shadow-outline-blue ${
                formik.touched.billNumber && formik.errors.billNumber
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={formik.values.billNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.billNumber && formik.errors.billNumber ? (
              <div className="text-red-500">{formik.errors.billNumber}</div>
            ) : null}
          </div>

          <div className="">
            <label
              htmlFor="soldDate"
              className="block mb-1 font-medium text-gray-700"
            >
              Sold Date
            </label>
            <input
              id="soldDate"
              name="soldDate"
              type="date"
              className={`w-full px-3 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:shadow-outline-blue ${
                formik.touched.soldDate && formik.errors.soldDate
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={formik.values.soldDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.soldDate && formik.errors.soldDate ? (
              <div className="text-red-500">{formik.errors.soldDate}</div>
            ) : null}
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <div>
                <label>Products (in Cases)</label>
                {formik.values?.products.map((product, index) => (
                  <div className="mb-4" key={index}>
                    <div className="flex items-center">
                      <FormControl className="mr-4 w-1/2" size="small">
                        <Select
                          labelId={`product-name-${index}-label`}
                          id={`product-name-${index}`}
                          name={`productId`}
                          value={product.productId}
                          onChange={(event) =>
                            handleProductChange(index, event)
                          }
                          onBlur={formik.handleBlur}
                        >
                          <MenuItem
                            value={""}
                            defaultChecked
                            disabled
                          ></MenuItem>
                          {products.map((option) => (
                            <MenuItem key={option} value={option._id}>
                              {option?.name} - {option?.pack}{" "}
                              {option?.unitOfMeasure} -{" "}
                              <span className="font-bold ml-1">
                                {" "}
                                Rs.{option?.mrp}
                                {"/- "}
                              </span>
                              {latestProduct.includes(option) && (
                                <span className="inline-block ml-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs">
                                  New
                                </span>
                              )}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <input
                        name={`quantity`}
                        type="number"
                        placeholder="Quantity"
                        value={product.quantity}
                        onChange={(event) => handleProductChange(index, event)}
                        onBlur={formik.handleBlur}
                        className="mr-4 px-4 py-2 w-1/4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                      />
                      {formik.values?.products.length > 1 && (
                        <button
                          type="button"
                          className="px-4 py-3 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-200"
                          onClick={() => removeProduct(index)}
                        >
                          <TrashIcon className="w-5 h-5 cursor-pointer text-red-00" />
                        </button>
                      )}
                      {formik.values?.products.length - 1 === index && (
                        <button
                          type="button"
                          className="px-4 py-3 ml-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-200"
                          onClick={handleAddProduct}
                        >
                          <PlusIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    {formik.touched.products?.[index]?.name &&
                    formik.errors.products?.[index]?.name ? (
                      <div className="text-red-500 ml-auto">
                        {formik.errors.products[index].name}
                      </div>
                    ) : null}
                    {formik.touched.products?.[index]?.quantity &&
                    formik.errors.products?.[index]?.quantity ? (
                      <div className="text-red-500 ml-auto">
                        {formik.errors.products[index].quantity}
                      </div>
                    ) : null}
                  </div>
                ))}
                {/* <button
                  type="button"
                  onClick={handleAddProduct}
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
                >
                  Add Product
                </button> */}
              </div>
              {/* <SelectSmall
                options={products}
                latestProduct={latestProduct}
                value={formik.values.products?.[0]}
                onChange={changeProduct}
              />
              {formik?.values?.products?.map((product) => {
                return (
                  <div>
                    <div className="m">
                      <label
                        htmlFor="quantity"
                        className="block mb-1 font-medium text-gray-700"
                      >
                        Quantity
                      </label>
                      <input
                        id="quantity"
                        name="quantity"
                        type="text"
                        className={`w-full px-3 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:shadow-outline-blue ${
                          formik.touched.products && formik.errors.products
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        value={product?.quantity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.products && formik.errors.products ? (
                        <div className="text-red-500">
                          {formik.errors.products}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })} */}
              {/* <MultiSelectField
                name="products"
                label="Products"
                options={products}
                onChange={changeProduct}
                latestProduct={latestProduct}
                values={formik.values.products}
                onBlur={formik.handleBlur}
                errors={formik.errors?.products && formik.touched?.products}
              /> */}
            </>
          )}
          <div className="">
            <label
              htmlFor="totalPrice"
              className="block mb-1 font-medium text-gray-700"
            >
              Total Price
            </label>
            <input
              id="totalPrice"
              name="totalPrice"
              type="number"
              className={`w-full px-3 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:shadow-outline-blue ${
                formik.touched.totalPrice && formik.errors.totalPrice
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={formik.values.totalPrice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.totalPrice && formik.errors.totalPrice ? (
              <div className="text-red-500">{formik.errors.totalPrice}</div>
            ) : null}
          </div>

          <div className="">
            <label
              htmlFor="dueAmount"
              className="block mb-1 font-medium text-gray-700"
            >
              Due Amount
            </label>
            <input
              id="dueAmount"
              name="dueAmount"
              type="number"
              className={`w-full px-3 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:shadow-outline-blue ${
                formik.touched.dueAmount && formik.errors.dueAmount
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={formik.values.dueAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.dueAmount && formik.errors.dueAmount ? (
              <div className="text-red-500">{formik.errors.dueAmount}</div>
            ) : null}
          </div>
        </div>
        <div className="flex gap-2 items-center mt-2">
          {formik.values?.payments?.map((paymentMethod, index) => (
            <PaymentMethod
              key={paymentMethod}
              methods={formik.values?.payments}
              index={index}
              paymentMethod={paymentMethod}
              removeMethod={removePaymentMethod}
              formik={formik}
            />
          ))}
          <button
            type="button"
            className="mt-4 px-4 py-3 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-200"
            onClick={handleAddPaymentMethod}
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-2">
          <label
            htmlFor="comments"
            className="block mb-1 font-medium text-gray-700"
          >
            Comments
          </label>
          <textarea
            id="comments"
            name="comments"
            className={`w-full px-3 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:shadow-outline-blue ${
              formik.touched.comments && formik.errors.comments
                ? "border-red-500"
                : "border-gray-300"
            }`}
            value={formik.values.comments}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows="3"
          />
          {formik.touched.comments && formik.errors.comments ? (
            <div className="text-red-500">{formik.errors.comments}</div>
          ) : null}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 mt-4 rounded-md md:text-md w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BillForm;
