// import { addressDummyData } from "@/assets/assets";
// import { useAppContext } from "@/context/AppContext";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// const OrderSummary = () => {

//   const { currency, router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems } = useAppContext()
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [userAddresses, setUserAddresses] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);


//   const fetchUserAddresses = async () => {
//     try {

//       const token = await getToken()
//       const { data } = await axios.get('/api/user/get-address', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       })

//       if (data.success) {
//         setUserAddresses(data.addresses)
//       }
//       if (data.addresses.length > 0) {
//         setSelectedAddress(data.addresses[0])
//       }
//       else {
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }

//   }

//   const handleAddressSelect = (address) => {
//     setSelectedAddress(address);
//     setIsDropdownOpen(false);
//   };

//   const calculateTotal = () => {
//     const subtotal = getCartAmount();
//     const tax = Math.floor(subtotal * 0.02);
//     return subtotal + tax;
//   };

//   const createOrder = async () => {

//     try {
//       if (!selectedAddress) {
//         toast.error("Please select an address")
//         return
//       }

//       let cartItemsArray = Object.keys(cartItems).map((key) => ({
//         product: key,
//         quantity: cartItems[key]
//       }))

//       cartItemsArray = cartItemsArray.filter(item => item.quantity > 0)

//       if (cartItemsArray.length === 0) {
//         return toast.error("Cart is empty")
//       }

//       const token = await getToken()
//       const { data } = await axios.post('/api/order/create', {
//         address: selectedAddress._id,
//         items: cartItemsArray
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       })

//       if (data.success) {
//         toast.success(data.message)
//         setCartItems({})
//         router.push(`/order-placed`)
//       }
//       else {
//         toast.error(data.message)
//       }

//     } catch (error) {
//       toast.error(error.message)

//     }

//   }
//   const handlePayment = async () => {
//     try {
//       // Validation
//       if (!selectedAddress) {
//         toast.error("Please select an address");
//         return;
//       }

//       let cartItemsArray = Object.keys(cartItems).map((key) => ({
//         product: key,
//         quantity: cartItems[key]
//       }));

//       cartItemsArray = cartItemsArray.filter(item => item.quantity > 0);

//       if (cartItemsArray.length === 0) {
//         return toast.error("Cart is empty");
//       }

//       setIsProcessing(true);

//       // Create checkout session
//       const token = await getToken();
//       const { data } = await axios.post('/api/payment/create-checkout-session', {
//         amount: calculateTotal(),
//         currency: currency,
//         cartItems: cartItemsArray,
//         addressId: selectedAddress._id
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (data.error) {
//         toast.error(data.error);
//         setIsProcessing(false);
//         return;
//       }

//       // Use the URL returned from Stripe directly
//       if (data.url) {
//         window.location.href = data.url;
//       } else {
//         toast.error("Failed to create checkout session");
//         setIsProcessing(false);
//       }

//     } catch (error) {
//       console.error('Payment error:', error);
//       toast.error(error.message || "Payment failed");
//       setIsProcessing(false);
//     }
//   };





//   useEffect(() => {
//     if (user) {
//       fetchUserAddresses();
//     }
//   }, [user])

//   return (
//     <div className="w-full md:w-96 bg-gray-500/5 p-5">
//       <h2 className="text-xl md:text-2xl font-medium text-gray-700">
//         Order Summary
//       </h2>
//       <hr className="border-gray-500/30 my-5" />
//       <div className="space-y-6">
//         <div>
//           <label className="text-base font-medium uppercase text-gray-600 block mb-2">
//             Select Address
//           </label>
//           <div className="relative inline-block w-full text-sm border">
//             <button
//               className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             >
//               <span>
//                 {selectedAddress
//                   ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
//                   : "Select Address"}
//               </span>
//               <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
//                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>

//             {isDropdownOpen && (
//               <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
//                 {userAddresses.map((address, index) => (
//                   <li
//                     key={index}
//                     className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
//                     onClick={() => handleAddressSelect(address)}
//                   >
//                     {address.fullName}, {address.area}, {address.city}, {address.state}
//                   </li>
//                 ))}
//                 <li
//                   onClick={() => router.push("/add-address")}
//                   className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
//                 >
//                   + Add New Address
//                 </li>
//               </ul>
//             )}
//           </div>
//         </div>

//         <div>
//           <label className="text-base font-medium uppercase text-gray-600 block mb-2">
//             Promo Code
//           </label>
//           <div className="flex flex-col items-start gap-3">
//             <input
//               type="text"
//               placeholder="Enter promo code"
//               className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
//             />
//             <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
//               Apply
//             </button>
//           </div>
//         </div>

//         <hr className="border-gray-500/30 my-5" />

//         <div className="space-y-4">
//           <div className="flex justify-between text-base font-medium">
//             <p className="uppercase text-gray-600">Items {getCartCount()}</p>
//             <p className="text-gray-800">{currency}{getCartAmount()}</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-gray-600">Shipping Fee</p>
//             <p className="font-medium text-gray-800">Free</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-gray-600">Tax (2%)</p>
//             <p className="font-medium text-gray-800">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
//           </div>
//           <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
//             <p>Total</p>
//             <p>{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.02)}</p>
//           </div>
//         </div>
//       </div>

//       {/* <button onClick={createOrder} className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700">
//         Place Order
//       </button> */}


//       <button
//         onClick={handlePayment}
//         disabled={isProcessing}
//         className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//       >
//         {isProcessing ? 'Processing...' : 'Proceed to Payment'}
//       </button>
//     </div>
//   );
// };

// export default OrderSummary;










import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PaymentMethodSelector from "./PaymentMethodSelector";

const OrderSummary = () => {
  const { currency, router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems } = useAppContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/user/get-address', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const calculateTotal = () => {
    const subtotal = getCartAmount();
    const tax = Math.floor(subtotal * 0.02);
    return subtotal + tax;
  };

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  const createOrder = async () => {
    try {
      if (!selectedAddress) {
        toast.error("Please select an address");
        return;
      }

      let cartItemsArray = Object.keys(cartItems).map((key) => ({
        product: key,
        quantity: cartItems[key]
      }));

      cartItemsArray = cartItemsArray.filter(item => item.quantity > 0);

      if (cartItemsArray.length === 0) {
        return toast.error("Cart is empty");
      }

      const token = await getToken();
      const { data } = await axios.post('/api/order/create', {
        address: selectedAddress._id,
        items: cartItemsArray,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      

      if (data.success) {
        toast.success(data.message);
        setCartItems({});
        router.push('/order-placed');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  const handlePayment = async () => {
    try {
      // Validation
      if (!selectedAddress) {
        toast.error("Please select an address");
        return;
      }

      if (!selectedPaymentMethod) {
        toast.error("Please select a payment method");
        return;
      }

      let cartItemsArray = Object.keys(cartItems).map((key) => ({
        product: key,
        quantity: cartItems[key]
      }));

      cartItemsArray = cartItemsArray.filter(item => item.quantity > 0);

      if (cartItemsArray.length === 0) {
        return toast.error("Cart is empty");
      }

      setIsProcessing(true);

      // Handle Cash on Delivery
      if (selectedPaymentMethod === 'cod') {
        await createOrder();
        setIsProcessing(false);
        return;
      }

      console.log(selectedPaymentMethod, 'dkdkdkdkd');
      // Handle Stripe payment
      const token = await getToken();
      const { data } = await axios.post('/api/payment/create-checkout-session', {
        amount: calculateTotal(),
        currency: 'usd',
        cartItems: cartItemsArray,
        addressId: selectedAddress._id,
        paymentMethod: selectedPaymentMethod
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.error || !data.url) {
        toast.error(data.error || "Failed to create checkout session");
        console.log(data);
        setIsProcessing(false);
        return;
      }

      toast.success("Order created! Redirecting to payment...");

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to create checkout URL");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || "Payment failed");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user]);

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />

      <div className="space-y-6">
        {/* Address Selection */}
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Payment Method Selection */}
        <PaymentMethodSelector
          selectedMethod={selectedPaymentMethod}
          onPaymentMethodSelect={handlePaymentMethodSelect}
        />

        {/* Promo Code */}
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        {/* Price Summary */}
        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">{currency}{getCartAmount()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.02)}</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' 
        : 'Place Order'
          // selectedPaymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'
          }
      </button>
    </div>
  );
};

export default OrderSummary;
