import axios from "axios";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import React from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [type, setType] = useState();

  async function fetchData(_type) {
    setType(_type);
    const response = await axios.get(
      `/api/products?type=${_type}`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    setProducts(response.data);
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="px-6 lg:px-8 mt-8 lg:mt-16">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the products in your account.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex gap-5">
          <Link
            type="button"
            to={"/products/add"}
            className="block rounded-md bg-indigo-600 py-1.5 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Product
          </Link>
          <Link
            type="button"
            to={"#"}
            onClick={() =>
              type === "HISTORY" ? fetchData(null) : fetchData("HISTORY")
            }
            className="block rounded-md bg-gray-600 py-1.5 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {type === "HISTORY" ? "Products" : "Product History"}
          </Link>
        </div>
      </div>
      {products?.length ? (
        <>
          {products?.map((e) => (
            <div className="mt-8">
              <h1 className="text-center font-bold text-xl mb-2">
                Stock Arrived Date - {e?._id}
              </h1>
              <hr />
              <div className="flow-root">
                <div className="sm:-mx-0">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                        >
                          Stock Left
                        </th>
                        <th
                          scope="col"
                          className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                        >
                          Manufactured Date
                        </th>
                        <th
                          scope="col"
                          className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                        >
                          Expiry Date
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                        >
                          Days Left
                        </th>
                        <th
                          scope="col"
                          className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                        >
                          Billing Price Retail
                        </th>
                        <th
                          scope="col"
                          className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                        >
                          Margin Per Bottle
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-6 sm:pr-0 text-center"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {e?.products?.map((product) => (
                        <tr
                          key={product?.email || ""}
                          className={`${
                            moment(product.expiryDate).diff(moment(), "days") <
                              30 && "bg-red-200 font-bold"
                          }`}
                        >
                          <td
                            className={`w-full max-w-0 py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0`}
                          >
                            {product?.name || ""}
                            <dl className="font-normal lg:hidden">
                              <dt className="sr-only">Stock Left</dt>
                              <dd className="mt-1 truncate text-gray-700">
                                {product?.stockLeft || ""}
                              </dd>
                              <dt className="sr-only lg:hidden">
                                Manufactured Date
                              </dt>
                              <dd className="mt-1 truncate text-gray-500 lg:hidden">
                                {moment(product?.manufacturedDate).format(
                                  "YYYY-MM-DD"
                                )}{" "}
                                -{" "}
                                {moment(product?.expiryDate).format(
                                  "YYYY-MM-DD"
                                ) || ""}
                              </dd>
                            </dl>
                          </td>
                          <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                            <span className="font-bold">
                              {parseFloat(
                                product?.stockLeft / product?.units
                              )?.toFixed(2) || ""}{" "}
                            </span>
                            {` (${product?.stockLeft}`} {" Bottles)"}
                          </td>
                          <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                            {moment(product?.manufacturedDate).format(
                              "YYYY-MM-DD"
                            ) || ""}
                          </td>
                          <td className="hidden px-3 py-4 text-sm text-gray-500  lg:table-cell">
                            {moment(product?.expiryDate).format("YYYY-MM-DD") ||
                              ""}
                          </td>
                          <td
                            className={`px-3 py-4 text-sm font-bold ${
                              moment(product.expiryDate).diff(
                                moment(),
                                "days"
                              ) < 30
                                ? "text-red-500"
                                : "text-gray-500"
                            }`}
                          >
                            {moment(product.expiryDate).diff(
                              moment(),
                              "days"
                            ) || ""}
                          </td>
                          <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                            ₹ {product?.billingPriceRetail}
                          </td>
                          <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                            ₹ {product?.marginPerBottle}
                          </td>
                          <td className="hidden py-4 pl-3 pr-6 text-center text-sm font-medium sm:pr-0 lg:table-cell">
                            <a
                              href="#"
                              className="text-indigo-600 hover:text-indigo-900 "
                            >
                              Edit
                              <span className="sr-only">
                                , {product?.name || ""}
                              </span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="text-center font-bold text-3xl">No Data Found!</div>
      )}
    </div>
  );
}
