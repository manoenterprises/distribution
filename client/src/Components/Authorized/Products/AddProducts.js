import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import Alert from "../../Utils/Alert";
import axios from "axios";

function AddProducts() {
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    stock: Yup.number().required("Stock is required").positive("Invalid Stock"),
    landingDate: Yup.date().required("Landing date is required"),
    expiryDate: Yup.date().required("Expiry date is required"),
    manufacturedDate: Yup.date().required("Manufactured date is required"),
    pack: Yup.number().required("Pack is required").positive("Invalid Pack"),
    units: Yup.number().required("Units is required").positive("Units"),
    mrp: Yup.number().required("MRP is required").positive("Invalid MRP"),
    billingPriceRetail: Yup.number()
      .required("Billing price retail is required")
      .positive("Invalid Billing price"),
    schemeAmount: Yup.number()
      .required("Scheme amount is required")
      .positive("Invalid Scheme Amount"),
    netPrice: Yup.number()
      .required("Net price is required")
      .positive("Invalid Net Price"),
    retailPriceBottle: Yup.number()
      .required("Retail price bottle is required")
      .positive("Invalid Retail Price"),
    marginPerBottle: Yup.number()
      .required("Margin per bottle is required")
      .positive("Invalid Margin"),
    particulars: Yup.string().required("Particulars are required"),
    unitOfMeasure: Yup.string().required("Unit of measure is required"),
  });
  const [response, setResponse] = useState(null);
  const formik = useFormik({
    initialValues: {
      name: "",
      stock: "",
      landingDate: "",
      expiryDate: "",
      manufacturedDate: "",
      pack: "",
      units: "",
      mrp: "",
      billingPriceRetail: "",
      schemeAmount: "",
      netPrice: "",
      retailPriceBottle: "",
      marginPerBottle: "",
      particulars: "",
      unitOfMeasure: "ML",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          `/api/products`,
          values,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        if (response?.data && response?.status === 201) {
          setResponse({
            type: "success",
            message: "Product created successfully",
          });
          resetForm();
        } else {
          setResponse({
            type: "error",
            message: "Error creating product",
          });
        }
        window.scrollTo(0, 0);
      } catch (error) {
        setResponse({
          type: "error",
          message: error?.response?.data?.message || "Error creating product",
        });
        window.scrollTo(0, 0);
      }
    },
  });
  const { values, setValues } = formik;

  useEffect(() => {
    if (values?.billingPriceRetail && values?.schemeAmount && values?.mrp) {
      let netPrice = values?.billingPriceRetail - values?.schemeAmount;
      let retailPriceBottle = netPrice / values?.schemeAmount;
      let marginPerBottle = values?.mrp - retailPriceBottle;
      setValues({ ...values, netPrice, retailPriceBottle, marginPerBottle });
    }
  }, [values?.billingPriceRetail, values?.schemeAmount, values?.mrp]);

  return (
    <div className="px-4 sm:px-8 mt-8 mb-8">
      <div className="md:flex md:items-center md:justify-between  mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Add a product
          </h2>
        </div>
      </div>{" "}
      {response && (
        <Alert
          type={response?.type}
          message={response?.message}
          reset={setResponse}
        />
      )}
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-4">
            <label htmlFor="name" className="font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className={`${
                formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : "border-gray-300"
              } border p-2 rounded-md`}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <label htmlFor="stock" className="font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.stock}
              className={`${
                formik.touched.stock && formik.errors.stock
                  ? "border-red-500"
                  : "border-gray-300"
              } border p-2 rounded-md`}
            />
            {formik.touched.stock && formik.errors.stock && (
              <div className="text-red-500 text-sm">{formik.errors.stock}</div>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <label
              htmlFor="manufacturedDate"
              className="font-medium text-gray-700"
            >
              Manufactured Date
            </label>
            <input
              type="date"
              id="manufacturedDate"
              name="manufacturedDate"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.manufacturedDate}
              className={`${
                formik.touched.manufacturedDate &&
                formik.errors.manufacturedDate
                  ? "border-red-500"
                  : "border-gray-300"
              } border p-2 rounded-md`}
            />
            {formik.touched.manufacturedDate &&
              formik.errors.manufacturedDate && (
                <div className="text-red-500 text-sm">
                  {formik.errors.manufacturedDate}
                </div>
              )}
          </div>

          <div className="flex flex-col space-y-4">
            <label htmlFor="expiryDate" className="font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.expiryDate}
              className={`${
                formik.touched.expiryDate && formik.errors.expiryDate
                  ? "border-red-500"
                  : "border-gray-300"
              } border p-2 rounded-md`}
            />
            {formik.touched.expiryDate && formik.errors.expiryDate && (
              <div className="text-red-500 text-sm">
                {formik.errors.expiryDate}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <label htmlFor="landingDate" className="font-medium text-gray-700">
              Landing Date{" "}
              <span className="font-normal text-gray-500 text-sm">
                (Date of stock that landed into godown/warehouse/inventry)
              </span>
            </label>
            <input
              type="date"
              id="landingDate"
              name="landingDate"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.landingDate}
              className={`${
                formik.touched.landingDate && formik.errors.landingDate
                  ? "border-red-500"
                  : "border-gray-300"
              } border p-2 rounded-md`}
            />
            {formik.touched.landingDate && formik.errors.landingDate && (
              <div className="text-red-500 text-sm">
                {formik.errors.landingDate}
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-4">
            <label htmlFor="pack" className="font-medium text-gray-700">
              Pack{" "}
              <span className="font-normal text-gray-500 text-sm">
                (Quantity of the bottle ex: 250 / 750 / 1750 / 2000 ML)
              </span>
            </label>
            <select
              id="pack"
              name="pack"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.pack}
              className={`${
                formik.touched.pack && formik.errors.pack
                  ? "border-red-500"
                  : "border-gray-300"
              } border p-2 rounded-md`}
            >
              <option value="" disabled>
                Select pack size
              </option>
              {[200, 250, 500, 600, 750, 1750, 2000].map((size) => (
                <option key={size} value={size}>
                  {size} ML
                </option>
              ))}
            </select>
            {formik.touched.pack && formik.errors.pack && (
              <div className="text-red-500 text-sm">{formik.errors.pack}</div>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <label htmlFor="units" className="font-medium text-gray-700">
              Units{" "}
              <span className="font-normal text-gray-500 text-sm ml-1">
                (Bottles per case)
              </span>
            </label>
            <select
              id="units"
              name="units"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.units}
              className={`${
                formik.touched.units && formik.errors.units
                  ? "border-red-500"
                  : "border-gray-300"
              } border p-2 rounded-md`}
            >
              {["9", "12", "24", "30"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {formik.touched.units && formik.errors.units && (
              <div className="text-red-500 text-sm">{formik.errors.units}</div>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <label htmlFor="mrp" className="font-medium text-gray-700">
              MRP{" "}
              <span className="font-normal text-gray-500 text-sm">
                (Maximum Retail Price)
              </span>
            </label>
            <input
              type="number"
              id="mrp"
              name="mrp"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mrp}
              className={`${
                formik.touched.mrp && formik.errors.mrp
                  ? "border-red-500"
                  : "border-gray-300"
              } border p-2 rounded-md`}
            />
            {formik.touched.mrp && formik.errors.mrp && (
              <div className="text-red-500 text-sm">{formik.errors.mrp}</div>
            )}
          </div>
          <div className="flex flex-col space-y-4">
            <label
              htmlFor="billingPriceRetail"
              className="font-medium text-gray-700"
            >
              Billing Price Retail
            </label>
            <input
              type="number"
              id="billingPriceRetail"
              name="billingPriceRetail"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.billingPriceRetail}
              className={`${
                formik.touched.billingPriceRetail &&
                formik.errors.billingPriceRetail
                  ? "border-red-500"
                  : "border-gray-300"
              } border p-2 rounded-md`}
            />
            {formik.touched.billingPriceRetail &&
              formik.errors.billingPriceRetail && (
                <div className="text-red-500 text-sm">
                  {formik.errors.billingPriceRetail}
                </div>
              )}
          </div>

          <div className="flex flex-col space-y-4">
            <label htmlFor="schemeAmount" className="font-medium text-gray-700">
              Scheme Amount
            </label>
            <input
              type="number"
              id="schemeAmount"
              name="schemeAmount"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.schemeAmount}
              className={`${
                formik.touched.schemeAmount && formik.errors.schemeAmount
                  ? "border-red-500"
                  : "border-gray-300"
              } border p-2 rounded-md`}
            />
            {formik.touched.schemeAmount && formik.errors.schemeAmount && (
              <div className="text-red-500 text-sm">
                {formik.errors.schemeAmount}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <label htmlFor="netPrice" className="font-medium text-gray-700">
              Net Price
            </label>
            <input
              type="number"
              id="netPrice"
              name="netPrice"
              disabled
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.netPrice}
              className={`${
                formik.touched.netPrice && formik.errors.netPrice
                  ? "border-red-500"
                  : "border-gray-300"
              } border p-2 rounded-md`}
            />
            {formik.touched.netPrice && formik.errors.netPrice && (
              <div className="text-red-500 text-sm">
                {formik.errors.netPrice}
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-4">
            <label
              htmlFor="retailPriceBottle"
              className="font-medium text-gray-700"
            >
              Retail Price Bottle
            </label>
            <input
              type="number"
              id="retailPriceBottle"
              name="retailPriceBottle"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled
              value={formik.values.retailPriceBottle}
              className={`${
                formik.touched.retailPriceBottle &&
                formik.errors.retailPriceBottle
                  ? "border-red-500"
                  : "border-gray-300"
              } border p-2 rounded-md`}
            />
            {formik.touched.retailPriceBottle &&
              formik.errors.retailPriceBottle && (
                <div className="text-red-500 text-sm">
                  {formik.errors.retailPriceBottle}
                </div>
              )}
          </div>
          <div className="flex flex-col space-y-4">
            <label
              htmlFor="marginPerBottle"
              className="font-medium text-gray-700"
            >
              Margin Per Bottle
            </label>
            <input
              type="number"
              id="marginPerBottle"
              name="marginPerBottle"
              onChange={formik.handleChange}
              disabled
              onBlur={formik.handleBlur}
              value={formik.values.marginPerBottle}
              className={`${
                formik.touched.marginPerBottle && formik.errors.marginPerBottle
                  ? "border-red-500"
                  : "border-gray-300"
              } border p-2 rounded-md`}
            />
            {formik.touched.marginPerBottle &&
              formik.errors.marginPerBottle && (
                <div className="text-red-500 text-sm">
                  {formik.errors.marginPerBottle}
                </div>
              )}
          </div>

          <div className="flex flex-col space-y-4">
            <label
              htmlFor="unitOfMeasure"
              className="font-medium text-gray-700"
            >
              Unit of Measure
            </label>
            <select
              id="unitOfMeasure"
              name="unitOfMeasure"
              disabled
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.unitOfMeasure}
              className={`${
                formik.touched.unitOfMeasure && formik.errors.unitOfMeasure
                  ? "border-red-500"
                  : "border-gray-300"
              } border p-2 rounded-md`}
            >
              <option value="ML" selected>
                ML (Milliliters)
              </option>
              <option value="L" disabled>
                L (Liters)
              </option>
            </select>
            {formik.touched.unitOfMeasure && formik.errors.unitOfMeasure && (
              <div className="text-red-500 text-sm">
                {formik.errors.unitOfMeasure}
              </div>
            )}
          </div>

          <div className="flex flex-col col-span-2 space-y-4">
            <label htmlFor="particulars" className="font-medium text-gray-700">
              Particulars
            </label>
            <textarea
              type="text"
              id="particulars"
              name="particulars"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.particulars}
              className={`${
                formik.touched.particulars && formik.errors.particulars
                  ? "border-red-500"
                  : "border-gray-300"
              } border p-2 rounded-md`}
            />
            {formik.touched.particulars && formik.errors.particulars && (
              <div className="text-red-500 text-sm">
                {formik.errors.particulars}
              </div>
            )}
          </div>
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
}
export default AddProducts;
