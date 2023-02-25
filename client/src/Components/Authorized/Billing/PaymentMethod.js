import { TrashIcon } from "@heroicons/react/24/outline";

const PaymentMethod = ({
  index,
  methods,
  removeMethod,
  formik,
  paymentMethod,
}) => {
  const method = methods[index];

  const handleNameChange = (e) => {
    methods[index].method = e.target.value;
    formik.setFieldValue("payments", methods);
  };

  const handleAmountChange = (e) => {
    methods[index].amount = e.target.value;
    formik.setFieldValue("payments", methods);
  };

  return (
    <div className="flex items-center mb-4">
      <div className="w-1/2 mr-4">
        <label
          htmlFor={`paymentMethod${index}`}
          className="block text-gray-700 font-medium mb-2"
        >
          Payment Method {index + 1}
        </label>
        <div className="flex items-center gap-2">
          <select
            id={`paymentMethod${index}`}
            name={`paymentMethods[${index}].name`}
            className="w-full px-3 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:shadow-outline-blue border-gray-300"
            onChange={handleNameChange}
            value={formik.values?.payments?.[index]?.name}
          >
            <option
              value="CASH"
            >
              Cash
            </option>
            <option
              value="UPI"
            >
              UPI
            </option>
          </select>
        </div>
      </div>
      <div className="w-1/2">
        <label
          htmlFor={`paymentAmount${index}`}
          className="block text-gray-700 font-medium mb-2"
        >
          Amount
        </label>
        <div className="flex items-center gap-2">
          <input
            id={`paymentAmount${index}`}
            name={`paymentMethods[${index}].amount`}
            type="number"
            min="0"
            className="w-full px-3 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:shadow-outline-blue border-gray-300"
            onChange={handleAmountChange}
            value={formik.values?.payments?.[index]?.amount}
          />

          {methods?.length > 1 && (
            <button
              type="button"
              className="px-4 py-3 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-200"
              onClick={() => removeMethod(index)}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
