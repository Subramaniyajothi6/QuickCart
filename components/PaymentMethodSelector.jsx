const PaymentMethodSelector = ({ onPaymentMethodSelect, selectedMethod }) => {
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay securely with Stripe',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-3">
      <label className="text-base font-medium uppercase text-gray-600 block mb-3">
        Payment Method
      </label>
      
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          onClick={() => onPaymentMethodSelect(method.id)}
          className={`
            flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all
            ${selectedMethod === method.id 
              ? 'border-orange-600 bg-orange-50' 
              : 'border-gray-300 hover:border-orange-400 bg-white'
            }
          `}
        >
          {/* Radio Button */}
          <div className="flex-shrink-0">
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${selectedMethod === method.id 
                ? 'border-orange-600' 
                : 'border-gray-400'
              }
            `}>
              {selectedMethod === method.id && (
                <div className="w-3 h-3 rounded-full bg-orange-600"></div>
              )}
            </div>
          </div>

          {/* Icon */}
          <div className={`
            flex-shrink-0
            ${selectedMethod === method.id 
              ? 'text-orange-600' 
              : 'text-gray-600'
            }
          `}>
            {method.icon}
          </div>

          {/* Text Content */}
          <div className="flex-grow">
            <p className={`
              font-medium
              ${selectedMethod === method.id 
                ? 'text-orange-600' 
                : 'text-gray-800'
              }
            `}>
              {method.name}
            </p>
            <p className="text-sm text-gray-600">{method.description}</p>
          </div>

          {/* Selected Badge */}
          {selectedMethod === method.id && (
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;
